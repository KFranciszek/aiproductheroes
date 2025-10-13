"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/lib/demo6/data-context";
import { toast } from "sonner";

export function VerifyView() {
  const { findings, createTaskFromFinding } = useData();

  const handleCreateTask = async (findingId: string) => {
    try {
      const taskId = await createTaskFromFinding(findingId);
      toast.success("Utworzono zadanie naprawcze", {
        description: `Zadanie ${taskId} zostało utworzone`,
      });
    } catch (error) {
      toast.error("Błąd tworzenia zadania", {
        description: "Spróbuj ponownie",
      });
    }
  };

  const getSeverityVariant = (severity: string) => {
    if (severity === "high") return "destructive";
    if (severity === "medium") return "default";
    return "secondary";
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Weryfikator wymagań</CardTitle>
          <CardDescription>Braki, niespójności i niejednoznaczności</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Typ</TableHead>
                <TableHead>Poziom</TableHead>
                <TableHead>Opis</TableHead>
                <TableHead>Źródło</TableHead>
                <TableHead className="text-right">Akcja</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {findings.map((finding) => (
                <TableRow key={finding.id}>
                  <TableCell className="font-medium">{finding.type}</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityVariant(finding.severity) as any}>
                      {finding.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[360px]">{finding.summary}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {finding.sources.join(", ")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCreateTask(finding.id)}
                    >
                      Create Task
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>TraceMatrix</CardTitle>
          <CardDescription>Powiązania Doc ↔ Story ↔ Release</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Checkout_v2.pdf → SZ-1234 → R-102</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>Pricing.md → SZ-1234 → R-102</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>payments.yaml → SZ-1235 → R-102</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
