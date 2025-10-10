import type { Priority, Status } from "./types";

export const priorityColors: Record<Priority, string> = {
  P0: "bg-destructive text-destructive-foreground",
  P1: "bg-orange-500 text-white",
  P2: "bg-primary text-primary-foreground",
  P3: "bg-muted text-muted-foreground",
}

export const statusColors: Record<Status, string> = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-primary text-primary-foreground",
  in_review: "bg-info text-white",
  blocked: "bg-destructive text-destructive-foreground",
  done: "bg-success text-white",
}

export const statusLabels: Record<Status, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  blocked: "Blocked",
  done: "Done",
}
