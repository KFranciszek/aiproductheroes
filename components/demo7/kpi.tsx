import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";

export function KPI({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="kpi-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        {hint && <div className="text-xs text-muted mt-1">{hint}</div>}
      </CardContent>
    </Card>
  );
}
