import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Check } from 'lucide-react';
import { useTheme } from './extended-theme-provider';

export function ThemeSelector() {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Wybierz motyw
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableThemes.map((themeOption) => (
            <Button
              key={themeOption.id}
              variant={theme === themeOption.id ? "default" : "outline"}
              className="flex flex-col items-center gap-2 h-auto p-4 relative"
              onClick={() => setTheme(themeOption.id)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: themeOption.colors.primary }}
                />
                <span className="font-medium">{themeOption.name}</span>
              </div>
              {theme === themeOption.id && (
                <Badge variant="secondary" className="absolute -top-1 -right-1">
                  <Check className="h-3 w-3" />
                </Badge>
              )}
            </Button>
          ))}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Aktualny motyw: <span className="font-medium">{availableThemes.find(t => t.id === theme)?.name || 'System'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
