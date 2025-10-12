"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { getState, subscribe, setWeights, exportJson, importJson } from "@/lib/demo7/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Page() {
  const [s, setS] = useState(getState());
  const [w, setW] = useState([s.settings.healthWeights.outcome, s.settings.healthWeights.delivery, s.settings.healthWeights.quality]);
  useEffect(() => { const unsubscribe = subscribe(setS); return unsubscribe; }, []);
  const onExport = () => {
    const data = exportJson();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nova-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Settings</h2>
        <p className="text-muted-foreground">Configure system preferences and data management</p>
      </div>
      <Card className="shadow-sm">
        <CardHeader><CardTitle>Health Weights</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Adjust the weight of each factor in health calculations</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Outcome</span>
                <span className="font-semibold">{w[0].toFixed(2)}</span>
              </div>
              <Slider value={[w[0]]} min={0} max={1} step={0.01} onValueChange={([v]) => setW([v, w[1], w[2]])} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Delivery</span>
                <span className="font-semibold">{w[1].toFixed(2)}</span>
              </div>
              <Slider value={[w[1]]} min={0} max={1} step={0.01} onValueChange={([v]) => setW([w[0], v, w[2]])} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Quality</span>
                <span className="font-semibold">{w[2].toFixed(2)}</span>
              </div>
              <Slider value={[w[2]]} min={0} max={1} step={0.01} onValueChange={([v]) => setW([w[0], w[1], v])} />
            </div>
          </div>
          <Button onClick={() => { setWeights(w[0], w[1], w[2]); toast.success("Weights updated"); }}>Save Changes</Button>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader><CardTitle>Data Management</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-3">
          <Button onClick={onExport}>Export JSON</Button>
          <input type="file" accept="application/json" className="hidden" ref={fileInputRef} onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { importJson(String(reader.result)); toast.success("Data imported successfully"); }; reader.readAsText(file); }} />
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>Import JSON</Button>
        </CardContent>
      </Card>
    </div>
  );
}
