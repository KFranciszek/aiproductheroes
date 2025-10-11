"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/lib/demo6/data-context";

export function ReleaseQA() {
  const { releases } = useData();
  const [selectedRelease, setSelectedRelease] = useState("R-102");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const release = releases.find(r => r.id === selectedRelease);

  const handleQuestion = (question: string) => {
    setIsLoading(true);
    setAnswer("");
    setTimeout(() => {
      setAnswer(`Release ${release?.id} (${release?.environment}, ${release?.deployedAt}) zawiera issues: ${release?.issues.join(", ")}. Pokrycie AC: SZ-1234 2/3, SZ-1235 0/0.`);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Wybierz release</CardTitle>
          <CardDescription>Odpowiemy na najczęstsze pytania</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedRelease} onValueChange={setSelectedRelease}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {releases.map(r => (
                <SelectItem key={r.id} value={r.id}>
                  {r.id} · {r.environment}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-accent"
              onClick={() => handleQuestion("Co było w paczce?")}
            >
              Co było w paczce?
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-accent"
              onClick={() => handleQuestion("Czy gate spełnione?")}
            >
              Czy gate spełnione?
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-accent"
              onClick={() => handleQuestion("Co się zmieniło?")}
            >
              Co się zmieniło vs poprzedni?
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Odpowiedź Canis</CardTitle>
          <CardDescription>Źródła: DevMon + PM + Canis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8 animate-pulse-subtle">
              Analizuję release...
            </div>
          ) : answer ? (
            <>
              <div className="rounded-xl border p-4 text-sm bg-muted/30">
                {answer}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Open in DevMon</Button>
                <Button variant="outline" size="sm">Open in PM</Button>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Wybierz pytanie aby uzyskać odpowiedź
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
