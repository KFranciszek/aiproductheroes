import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface FavoriteButtonProps {
  issueId: string;
  isFavorite: boolean;
  onToggle: (issueId: string) => void;
}

export function FavoriteButton({ issueId, isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onToggle(issueId)}
      className={`p-1 opacity-100 hover:opacity-100 ${isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
    >
      <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
    </Button>
  );
}
