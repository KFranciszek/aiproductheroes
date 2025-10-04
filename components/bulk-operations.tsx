// components/bulk-operations.tsx
import React, { useState } from 'react';
import type { Issue, Priority, IssueStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface BulkOperationsProps {
  selectedIssues: Set<string>;
  issues: Issue[];
  onBulkUpdate: (updates: Partial<Issue>) => void;
  onBulkDelete: () => void;
}

export function BulkOperations({
  selectedIssues,
  issues,
  onBulkUpdate,
  onBulkDelete
}: BulkOperationsProps) {
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkValue, setBulkValue] = useState<string>('');

  const handleBulkAction = () => {
    if (!bulkAction || selectedIssues.size === 0) return;

    switch (bulkAction) {
      case 'update_priority':
        onBulkUpdate({ priority: bulkValue as Priority });
        break;
      case 'update_status':
        onBulkUpdate({ status: bulkValue as IssueStatus });
        break;
      case 'assign':
        onBulkUpdate({ assignee: bulkValue });
        break;
      case 'delete':
        onBulkDelete();
        break;
    }
  };

  if (selectedIssues.size === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedIssues.size} issues selected
          </span>

          <div className="flex items-center gap-2">
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Bulk action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update_priority">Change Priority</SelectItem>
                <SelectItem value="update_status">Change Status</SelectItem>
                <SelectItem value="assign">Assign To</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>

            {bulkAction && bulkAction !== 'delete' && (
              <Select value={bulkValue} onValueChange={setBulkValue}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Value" />
                </SelectTrigger>
                <SelectContent>
                  {bulkAction === 'update_priority' && (
                    <>
                      <SelectItem value="P0">P0 - Critical</SelectItem>
                      <SelectItem value="P1">P1 - High</SelectItem>
                      <SelectItem value="P2">P2 - Medium</SelectItem>
                      <SelectItem value="P3">P3 - Normal</SelectItem>
                    </>
                  )}
                  {bulkAction === 'update_status' && (
                    <>
                      <SelectItem value="Todo">Todo</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="In Review">In Review</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            )}

            <Button onClick={handleBulkAction} size="sm">
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


