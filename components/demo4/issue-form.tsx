"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useData } from "@/lib/demo4/data-context";
import { toast } from "sonner";
import type { Priority, Status } from "@/lib/demo4/types";

interface IssueFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issueId?: string;
}

export function IssueForm({ open, onOpenChange, issueId }: IssueFormProps) {
  const { issues, users, sprints, addIssue, updateIssue } = useData();
  
  const existingIssue = issueId ? issues.find(i => i.id === issueId) : null;
  
  const [title, setTitle] = useState(existingIssue?.title || "");
  const [description, setDescription] = useState(existingIssue?.description || "");
  const [priority, setPriority] = useState<Priority>(existingIssue?.priority || "P2");
  const [status, setStatus] = useState<Status>(existingIssue?.status || "todo");
  const [assigneeId, setAssigneeId] = useState(existingIssue?.assigneeId || "");
  const [sprintId, setSprintId] = useState(existingIssue?.sprintId || "");
  const [storyPoints, setStoryPoints] = useState(existingIssue?.storyPoints?.toString() || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!assigneeId) {
      toast.error("Assignee is required");
      return;
    }

    try {
      const issueData = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        assigneeId,
        sprintId: sprintId || undefined,
        storyPoints: storyPoints ? parseInt(storyPoints) : undefined,
      };

      if (existingIssue) {
        updateIssue(existingIssue.id, issueData);
        toast.success("Issue updated successfully");
      } else {
        addIssue(issueData);
        toast.success("Issue created successfully");
      }

      onOpenChange(false);
      resetForm();
    } catch (error) {
      // Error is already handled by data-context with toast
      console.error("Failed to submit issue:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("P2");
    setStatus("todo");
    setAssigneeId("");
    setSprintId("");
    setStoryPoints("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {existingIssue ? "Edit Issue" : "Create New Issue"}
          </DialogTitle>
          <DialogDescription>
            {existingIssue 
              ? "Update the issue details below" 
              : "Fill in the details to create a new issue"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Short, descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P0">P0 - Critical</SelectItem>
                  <SelectItem value="P1">P1 - High</SelectItem>
                  <SelectItem value="P2">P2 - Medium</SelectItem>
                  <SelectItem value="P3">P3 - Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee *</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sprint">Sprint</Label>
              <Select value={sprintId} onValueChange={setSprintId}>
                <SelectTrigger id="sprint">
                  <SelectValue placeholder="No Sprint (Backlog)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Sprint (Backlog)</SelectItem>
                  {sprints.map((sprint) => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storyPoints">Story Points</Label>
            <Input
              id="storyPoints"
              type="number"
              min="0"
              placeholder="e.g., 5"
              value={storyPoints}
              onChange={(e) => setStoryPoints(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (existingIssue ? "Updating..." : "Creating...") 
                : (existingIssue ? "Update Issue" : "Create Issue")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
