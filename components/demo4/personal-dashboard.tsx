"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Calendar, CheckCircle2, Clock, ListTodo, LayoutGrid } from "lucide-react";
import { useData } from "@/lib/demo4/data-context";
import { useUI } from "@/lib/demo4/ui-context";
import { useRouter } from "next/navigation";

export function PersonalDashboard() {
  const { issues, sprints, currentUser } = useData();
  const { openIssueDetail } = useUI();
  const router = useRouter();

  const myIssues = issues.filter(i => i.assigneeId === currentUser.id);
  const urgentIssues = myIssues.filter(i => (i.priority === "P0" || i.priority === "P1") && i.status !== "done");
  const activeSprint = sprints.find(s => s.status === "active");
  
  const myIssuesByStatus = {
    todo: myIssues.filter(i => i.status === "todo").length,
    in_progress: myIssues.filter(i => i.status === "in_progress").length,
    in_review: myIssues.filter(i => i.status === "in_review").length,
    done: myIssues.filter(i => i.status === "done").length,
  };

  const sprintIssues = activeSprint ? issues.filter(i => i.sprintId === activeSprint.id) : [];
  const sprintDone = sprintIssues.filter(i => i.status === "done").length;
  const sprintTotal = sprintIssues.length;
  const sprintProgress = sprintTotal > 0 ? (sprintDone / sprintTotal) * 100 : 0;

  const daysLeft = activeSprint 
    ? Math.ceil((new Date(activeSprint.end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Twój Dzień
        </h1>
        <p className="text-[var(--text-secondary)]">
          {new Date().toLocaleDateString("pl-PL", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </p>
      </div>

      {/* Urgent Issues */}
      {urgentIssues.length > 0 && (
        <Card className="border-l-4 border-l-[var(--error)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[var(--error-text)]">
              <AlertCircle className="w-5 h-5" />
              Pilne zadania ({urgentIssues.length})
            </CardTitle>
            <CardDescription>Wymagają natychmiastowej uwagi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => openIssueDetail(issue.id)}
                className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors"
              >
                <Badge 
                  variant={issue.priority === "P0" ? "destructive" : "default"}
                  className="mt-0.5"
                >
                  {issue.priority}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--text-primary)] truncate">
                    {issue.title}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] font-mono">
                    {issue.key}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Your Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="w-5 h-5" />
              Twoje zadania
            </CardTitle>
            <CardDescription>Aktualny status Twoich zadań</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[var(--status-todo-bg)] border border-[var(--border-default)]">
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {myIssuesByStatus.todo}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">To Do</div>
              </div>
              
              <div className="p-3 rounded-lg bg-[var(--status-progress-bg)] border border-[var(--border-default)]">
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {myIssuesByStatus.in_progress}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">In Progress</div>
              </div>
              
              <div className="p-3 rounded-lg bg-[var(--status-review-bg)] border border-[var(--border-default)]">
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {myIssuesByStatus.in_review}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">In Review</div>
              </div>
              
              <div className="p-3 rounded-lg bg-[var(--status-done-bg)] border border-[var(--border-default)]">
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {myIssuesByStatus.done}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">Done</div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push("/demo4/issues")}
            >
              Zobacz wszystkie
            </Button>
          </CardContent>
        </Card>

        {/* Sprint Overview */}
        {activeSprint && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Sprint Overview
              </CardTitle>
              <CardDescription>{activeSprint.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Postęp</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {sprintDone}/{sprintTotal} zadań
                  </span>
                </div>
                <Progress value={sprintProgress} className="h-2" />
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-[var(--text-secondary)]">
                  {daysLeft > 0 ? `${daysLeft} dni do końca` : "Sprint kończy się dzisiaj"}
                </span>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push("/demo4/sprints")}
              >
                Zobacz szczegóły sprintu
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5" />
            Szybki widok
          </CardTitle>
          <CardDescription>Przejdź do najważniejszych widoków</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => router.push("/demo4/sprints")}
            >
              <Calendar className="w-6 h-6" />
              <span>Kanban</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => router.push("/demo4/issues")}
            >
              <ListTodo className="w-6 h-6" />
              <span>Wszystkie</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => router.push("/demo4/issues?filter=favorite")}
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>Ulubione</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => router.push("/demo4/sprints")}
            >
              <Calendar className="w-6 h-6" />
              <span>Sprinty</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
