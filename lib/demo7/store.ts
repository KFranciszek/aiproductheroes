"use client";
import { initialState } from "./mock";
import {
  State,
  ID,
  Objective,
  KeyResult,
  Epic,
  Issue,
  QualityGate,
  DoraSnapshot,
  Activity,
} from "./types";

type Listener = (s: State) => void;
let state: State =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("nova-state") || "null") || initialState
    : initialState;
const listeners = new Set<Listener>();

function save() {
  try {
    localStorage.setItem("nova-state", JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l(state));
}

export function getState() {
  return state;
}

export function subscribe(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function addActivity(message: string, type = "info") {
  const a: Activity = {
    id: crypto.randomUUID(),
    type,
    message,
    at: new Date().toISOString(),
  };
  state.activities.unshift(a);
  save();
}

// Selectors
export function objectiveById(id: ID) {
  return state.objectives.find((o) => o.id === id);
}

export function krById(id: ID) {
  return state.krs.find((k) => k.id === id);
}

export function epicById(id: ID) {
  return state.epics.find((e) => e.id === id);
}

export function issuesByIds(ids: ID[]) {
  return state.issues.filter((i) => ids.includes(i.id));
}

export function gatesByEpic(epicId: ID) {
  return state.gates.filter((g) => g.epicId === epicId);
}

export function coverageForKR(krId: ID) {
  const kr = krById(krId);
  if (!kr) return 0;
  const linked = kr.issueIds.length;
  const total = Math.max(linked, Math.round(kr.target / 3));
  return total === 0 ? 0 : linked / total;
}

export function gatePassRateForEpic(epicId: ID) {
  const gs = gatesByEpic(epicId);
  if (!gs.length) return 1;
  const pass = gs.filter((g) => g.status === "pass").length;
  return pass / gs.length;
}

export function avgGatePassForKR(krId: ID) {
  const kr = krById(krId);
  if (!kr) return 1;
  const rates = kr.epicIds.map(gatePassRateForEpic);
  if (!rates.length) return 1;
  return rates.reduce((a, b) => a + b, 0) / rates.length;
}

export function confidenceForKR(krId: ID) {
  const kr = krById(krId);
  if (!kr) return 0;
  const progress = Math.min(1, kr.current / kr.target);
  const coverage = coverageForKR(krId);
  const delivery = avgGatePassForKR(krId);
  const defectsPenalty = 0.05;
  const conf = 0.6 * progress + 0.25 * coverage + 0.15 * delivery - defectsPenalty;
  return Math.max(0, Math.min(1, conf));
}

export function outcomeHealthForObjective(objId: ID) {
  const obj = objectiveById(objId);
  if (!obj) return 0;
  const weights = state.settings.healthWeights;
  const krs = obj.krIds.map(krById).filter(Boolean) as KeyResult[];
  if (!krs.length) return 0;
  const confAvg =
    krs.map((k) => confidenceForKR(k.id)).reduce((a, b) => a + b, 0) /
    krs.length;
  const delivery =
    krs.map((k) => avgGatePassForKR(k.id)).reduce((a, b) => a + b, 0) /
    krs.length;
  const quality = 1 - 0.1;
  return (
    weights.outcome * confAvg +
    weights.delivery * delivery +
    weights.quality * quality
  );
}

// Mutations
export function createObjective(payload: Partial<Objective>) {
  const o: Objective = {
    id: crypto.randomUUID(),
    name: payload.name || "New Objective",
    owner: payload.owner || "Owner",
    start: payload.start || new Date().toISOString().slice(0, 10),
    end: payload.end || new Date().toISOString().slice(0, 10),
    krIds: [],
  };
  state.objectives.push(o);
  addActivity(`Objective created: ${o.name}`, "okr");
  save();
  return o;
}

export function createKR(objectiveId: ID, payload: Partial<KeyResult>) {
  const kr: KeyResult = {
    id: crypto.randomUUID(),
    objectiveId,
    name: payload.name || "New KR",
    unit: payload.unit || "pct",
    target: payload.target || 10,
    current: payload.current || 0,
    owner: payload.owner || "Owner",
    epicIds: [],
    issueIds: [],
    due: payload.due,
  };
  state.krs.push(kr);
  objectiveById(objectiveId)?.krIds.push(kr.id);
  addActivity(`KR created: ${kr.name}`, "okr");
  save();
  return kr;
}

export function linkIssueToKR(issueId: ID, krId: ID) {
  const kr = krById(krId);
  const issue = state.issues.find((i) => i.id === issueId);
  if (!kr || !issue) return;
  if (!kr.issueIds.includes(issueId)) kr.issueIds.push(issueId);
  if (!issue.krIds.includes(krId)) issue.krIds.push(krId);
  addActivity(`Linked issue ${issueId} to KR ${krId}`, "link");
  save();
}

export function unlinkIssueFromKR(issueId: ID, krId: ID) {
  const kr = krById(krId);
  const issue = state.issues.find((i) => i.id === issueId);
  if (!kr || !issue) return;
  kr.issueIds = kr.issueIds.filter((id) => id !== issueId);
  issue.krIds = issue.krIds.filter((id) => id !== krId);
  addActivity(`Unlinked issue ${issueId} from KR ${krId}`, "link");
  save();
}

export function setGateStatus(
  gateId: ID,
  status: "pass" | "fail" | "waived"
) {
  const g = state.gates.find((x) => x.id === gateId);
  if (!g) return;
  g.status = status;
  g.updatedAt = new Date().toISOString();
  addActivity(`Gate ${g.name} set to ${status}`, "gate");
  save();
}

export function createCorrectiveTask(
  title: string,
  krId?: ID,
  epicId?: ID
) {
  const issueId = crypto.randomUUID();
  const issue = {
    id: issueId,
    title,
    assignee: "",
    status: "todo",
    priority: "P1",
    storyPoints: 3,
    epicId,
    krIds: krId ? [krId] : [],
  } as Issue;
  state.issues.push(issue);
  if (krId) {
    krById(krId)?.issueIds.push(issueId);
  }
  addActivity(`Corrective task created: ${title}`, "task");
  save();
  return issue;
}

// Settings
export function setWeights(
  outcome: number,
  delivery: number,
  quality: number
) {
  const sum = outcome + delivery + quality || 1;
  state.settings.healthWeights = {
    outcome: outcome / sum,
    delivery: delivery / sum,
    quality: quality / sum,
  };
  addActivity("Updated health weights", "settings");
  save();
}

export function exportJson() {
  return JSON.stringify(state, null, 2);
}

export function importJson(json: string) {
  const parsed = JSON.parse(json) as State;
  state = parsed;
  addActivity("Imported data JSON", "settings");
  save();
}
