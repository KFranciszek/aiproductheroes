import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileText } from 'lucide-react';

interface DataManagerProps {
  onExport: () => string;
  onImport: (data: any) => void;
}

export function DataManager({ onExport, onImport }: DataManagerProps) {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = onExport();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `braintask-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        onImport(data);
        setImportStatus('success');
      } catch (error) {
        setImportStatus('error');
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Zarządzanie danymi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Eksport danych</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Pobierz kopię wszystkich swoich danych w formacie JSON.
          </p>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Eksportuj dane
          </Button>
        </div>

        <div>
          <h4 className="font-medium mb-2">Import danych</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Przywróć dane z wcześniej wyeksportowanego pliku.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importuj dane
          </Button>

          {importStatus === 'success' && (
            <p className="text-sm text-green-600 mt-2">Dane zostały pomyślnie zaimportowane.</p>
          )}
          {importStatus === 'error' && (
            <p className="text-sm text-red-600 mt-2">Błąd podczas importu danych. Sprawdź format pliku.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
