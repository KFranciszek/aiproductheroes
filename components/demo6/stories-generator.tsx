"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useData } from "@/lib/demo6/data-context";
import { toast } from "sonner";

export function StoriesGenerator() {
  const { generatedStories, generateStories } = useData();
  const [persona, setPersona] = useState("Buyer");
  const [goal, setGoal] = useState("Zapłacić kartą z autoryzacją 3DS");
  const [source, setSource] = useState("doc");
  const [includeNFR, setIncludeNFR] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await generateStories(persona, goal);
    setIsGenerating(false);
    toast.success("Wygenerowano stories", {
      description: `Utworzono 2 wariantów`,
    });
  };

  const handleExport = (storyId: string) => {
    toast.success("Wyeksportowano do PM", {
      description: "Utworzono zadanie SZ-2001",
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle>Generator Story</CardTitle>
          <CardDescription>INVEST + Gherkin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="persona">Persona</Label>
            <Input
              id="persona"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="np. Buyer, Admin"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Cel</Label>
            <Textarea
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Co użytkownik chce osiągnąć?"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Źródła</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger id="source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doc">Checkout_v2.pdf</SelectItem>
                <SelectItem value="api">payments.yaml</SelectItem>
                <SelectItem value="both">Oba</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="nfr"
              checked={includeNFR}
              onCheckedChange={setIncludeNFR}
            />
            <Label htmlFor="nfr" className="text-sm">
              Dodaj NFR (P95, WCAG)
            </Label>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !persona || !goal}
            className="w-full"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isGenerating ? "Generowanie..." : `Generate (${generatedStories.length > 0 ? generatedStories.length : 2})`}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Stories */}
      <div className="md:col-span-2 space-y-4">
        {generatedStories.length === 0 && !isGenerating && (
          <Alert>
            <AlertTitle>Brak wygenerowanych wariantów</AlertTitle>
            <AlertDescription>
              Uzupełnij formularz i kliknij <strong>Generate</strong>.
            </AlertDescription>
          </Alert>
        )}

        {isGenerating && (
          <Card className="animate-pulse-subtle">
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                Generowanie stories...
              </div>
            </CardContent>
          </Card>
        )}

        {generatedStories.map((story) => (
          <Card key={story.id} className="animate-fade-in">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{story.title}</CardTitle>
                  <CardDescription className="mt-1">
                    Estymata: <Badge variant="secondary">{story.estimate}</Badge> · 
                    DoD: AC pokryte testami e2e
                  </CardDescription>
                </div>
                {story.conflicts && story.conflicts.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Konflikt
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {story.conflicts && story.conflicts.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Wykryto konflikt</AlertTitle>
                  <AlertDescription>
                    {story.conflicts[0].description}
                    <Button variant="link" className="p-0 h-auto ml-2">
                      Zobacz {story.conflicts[0].existingIssueId}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <div className="text-sm font-medium mb-2">Acceptance Criteria</div>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {story.acceptanceCriteria.map((ac) => (
                    <li key={ac.id}>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">{ac.text}</code>
                    </li>
                  ))}
                </ul>
              </div>

              {story.sources && story.sources.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {story.sources.map((src, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {src.source}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm">
                  Refine
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleExport(story.id)}
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Export to PM
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
