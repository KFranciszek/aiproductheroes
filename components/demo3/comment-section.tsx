"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/demo3/ui/avatar"
import { Button } from "@/components/demo3/ui/button"
import { Textarea } from "@/components/demo3/ui/textarea"
import { Form, FormControl, FormField, FormItem } from "@/components/demo3/ui/form"
import { useData } from "@/lib/demo3/data-context"
import { Separator } from "@/components/demo3/ui/separator"
import { formatDistanceToNow } from "date-fns"
import type { Comment as CommentType } from "@/lib/demo3/types"

const commentSchema = z.object({
  content: z.string().min(1, "Comment can't be empty."),
})

interface CommentSectionProps {
  issueId: string
}

export function CommentSection({ issueId }: CommentSectionProps) {
  const { comments, users, addComment } = useData()
  const issueComments = comments
    .filter((c) => c.issueId === issueId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())


  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  })

  const onSubmit = (data: { content: string }) => {
    addComment(issueId, data.content)
    form.reset()
  }

  return (
    <div className="space-y-6 pt-2">
      <h3 className="text-lg font-medium">Comments ({issueComments.length})</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Add a comment..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="self-end" disabled={!form.formState.isValid}>
            Comment
          </Button>
        </form>
      </Form>
      <Separator />
      <div className="space-y-4">
        {issueComments.map((comment) => {
          const user = users.find((u) => u.id === comment.userId)
          return (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
