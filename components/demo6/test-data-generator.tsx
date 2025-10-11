"use client";

import { useState } from "react";
import { Database, Download, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useData } from "@/lib/demo6/data-context";
import { toast } from "sonner";

export function TestDataGenerator() {
  const { testDatasets, generateTestData } = useData();
  const [schema, setSchema] = useState("payments.yaml#/Card");
  const [recordCount, setRecordCount] = useState(500);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");

  const currentDataset = testDatasets[0];
  const sampleData = currentDataset?.records.slice(0, 2) || [];

  const handleGenerate = async () => {
    setIsGenerating(true);
    await generateTestData(schema, recordCount);
    setIsGenerating(false);
    toast.success("Wygenerowano dane", {
      description: `${recordCount} rekordów gotowych`,
    });
  };

  const handleExport = () => {
    toast.success(`Eksport ${exportFormat.toUpperCase()}`, {
      description: `Pobrano ${recordCount} rekordów`,
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-12">
      {/* Config Form */}
      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle>Generator danych testowych</CardTitle>
          <CardDescription>OpenAPI / JSON Schema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Schemat</Label>
            <Select value={schema} onValueChange={setSchema}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payments.yaml#/Card">payments.yaml#/Card</SelectItem>
                <SelectItem value="payments.yaml#/ChargeRequest">payments.yaml#/ChargeRequest</SelectItem>
                <SelectItem value="users.yaml#/User">users.yaml#/User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Liczba rekordów</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={recordCount}
                onChange={(e) => setRecordCount(Number(e.target.value))}
                min={1}
                max={10000}
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">rekordów</span>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Reguły (YAML)
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Reguły generatora</DialogTitle>
                <DialogDescription>
                  Walidacja i generatory domenowe
                </DialogDescription>
              </DialogHeader>
              <Textarea
                className="min-h-[220px] font-mono text-xs"
                defaultValue={`schema: ${schema}\nrules:\n  pan: luhn(cardBrand:VISA)\n  expiry: futureDate(months<=36)\n  amount: decimal(min:1,max:9999,scale:2)\n  currency: enum[PLN,EUR,USD]\nsize: ${recordCount}\nformat: csv`}
              />
              <DialogFooter>
                <Button>Zapisz</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1"
            >
              <Database className="mr-2 h-4 w-4" />
              {isGenerating ? "Generowanie..." : "Generate"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Format eksportu</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="sql">SQL</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleExport}
              disabled={!currentDataset}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Table */}
      <Card className="md:col-span-8">
        <CardHeader>
          <CardTitle>Podgląd</CardTitle>
          <CardDescription>
            pierwsze 2 z {currentDataset?.metadata.totalRecords || recordCount} rekordów
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sampleData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(sampleData[0]).map((key) => (
                      <TableHead key={key} className="font-mono text-xs">
                        {key}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleData.map((row, i) => (
                    <TableRow key={i}>
                      {Object.values(row).map((val, j) => (
                        <TableCell key={j} className="font-mono text-xs">
                          {String(val)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              Kliknij "Generate" aby wygenerować dane
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
