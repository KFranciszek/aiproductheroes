import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Traceability Map</h2>
        <p className="text-muted-foreground">Visualize connections between objectives, KRs, epics, and issues</p>
      </div>
      <Card className="shadow-sm">
        <CardHeader><CardTitle>Interactive Graph</CardTitle></CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Full interactive graph with drag & drop coming in V2
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Will show: Objective → KR → Epic → Issue hierarchy with status badges
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
