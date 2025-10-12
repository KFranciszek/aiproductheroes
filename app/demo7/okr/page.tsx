"use client";
import { useEffect, useState } from "react";
import {
  getState,
  subscribe,
  createObjective,
  createKR,
  krById,
  linkIssueToKR,
  unlinkIssueFromKR,
  confidenceForKR,
  coverageForKR,
  avgGatePassForKR,
} from "@/lib/demo7/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const [s, setS] = useState(getState());
  const [selectedKR, setSelectedKR] = useState<string | null>(null);
  useEffect(() => {
    const unsubscribe = subscribe(setS);
    return unsubscribe;
  }, []);
  const [newObj, setNewObj] = useState("");
  const [newKR, setNewKR] = useState({
    name: "",
    target: 10,
    unit: "pct",
    objectiveId: "",
  });
  const openKR = (id: string) => setSelectedKR(id);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">OKR Manager</h1>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Objectives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {s.objectives.map((o) => (
                <div key={o.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{o.name}</div>
                    <Badge>{o.owner}</Badge>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {o.krIds.map((kid) => {
                      const k = krById(kid)!;
                      const conf = confidenceForKR(k.id);
                      return (
                        <li
                          key={k.id}
                          className="flex items-center justify-between"
                        >
                          <button
                            className="text-sm underline-offset-2 hover:underline"
                            onClick={() => openKR(k.id)}
                          >
                            {k.name}
                          </button>
                          <span className="text-xs">
                            {Math.round(conf * 100)}%
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              <Separator />
              <div className="flex gap-2">
                <Input
                  placeholder="New Objective name"
                  value={newObj}
                  onChange={(e) => setNewObj(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (newObj.trim()) {
                      createObjective({ name: newObj });
                      setNewObj("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>New KR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                placeholder="KR name"
                value={newKR.name}
                onChange={(e) => setNewKR({ ...newKR, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Target"
                  value={newKR.target}
                  onChange={(e) =>
                    setNewKR({ ...newKR, target: Number(e.target.value) })
                  }
                />
                <Select
                  onValueChange={(v) =>
                    setNewKR({ ...newKR, unit: v as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pct">Percent</SelectItem>
                    <SelectItem value="abs">Absolute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select
                onValueChange={(v) =>
                  setNewKR({ ...newKR, objectiveId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Objective" />
                </SelectTrigger>
                <SelectContent>
                  {s.objectives.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  if (newKR.name && newKR.objectiveId) {
                    createKR(newKR.objectiveId, {
                      name: newKR.name,
                      target: newKR.target,
                      unit: newKR.unit as any,
                    });
                    setNewKR({
                      name: "",
                      target: 10,
                      unit: "pct",
                      objectiveId: "",
                    });
                  }
                }}
              >
                Create KR
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Instrukcja</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-80">
                Wybierz KR z listy po lewej, aby zobaczyć szczegóły i powiązać
                pracę.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <KRDrawer
        krId={selectedKR}
        onOpenChange={(o) => !o && setSelectedKR(null)}
      />
    </div>
  );
}

function KRDrawer({
  krId,
  onOpenChange,
}: {
  krId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [s, setS] = useState(getState());
  useEffect(() => {
    const unsubscribe = subscribe(setS);
    return unsubscribe;
  }, []);
  const kr = krId ? krById(krId) : null;
  const linked = new Set(kr?.issueIds || []);
  const conf = kr
    ? Math.round(
        100 *
          (kr.confidence ??
            (kr.current / kr.target) * 0.6 +
              coverageForKR(kr.id) * 0.25 +
              avgGatePassForKR(kr.id) * 0.15 -
              0.05)
      )
    : 0;
  return (
    <Sheet open={!!kr} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0">
        {kr && (
          <div className="flex flex-col h-full">
            <div className="h-14 px-4 border-b flex items-center justify-between">
              <div className="font-medium">{kr.name}</div>
              <Badge>{conf}%</Badge>
            </div>
            <div className="p-4 space-y-4 overflow-auto">
              <div className="rounded-xl border p-3">
                <div className="text-sm opacity-80">
                  Cel: {kr.target}
                  {kr.unit === "pct" ? "%" : ""} · Właściciel: {kr.owner || "—"}
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted/20">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(100, (kr.current / kr.target) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="font-medium mb-2">Powiązane zadania</div>
                <div className="space-y-2 max-h-[40vh] overflow-auto">
                  {s.issues.map((it) => (
                    <label key={it.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={linked.has(it.id)}
                        onChange={(e) =>
                          e.target.checked
                            ? linkIssueToKR(it.id, kr.id)
                            : unlinkIssueFromKR(it.id, kr.id)
                        }
                      />
                      <span className="text-sm">
                        {it.id} · {it.title}
                      </span>
                      <Badge className="ml-auto">{it.status}</Badge>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
