"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"
import { Reply, ThumbsUp } from "lucide-react"

interface Comment {
  id: string
  author: {
    name: string
    avatar?: string
  }
  content: string
  createdAt: Date
  likes: number
  replies?: Comment[]
}

interface CommentSectionProps {
  comments: Comment[]
  onAddComment: (content: string, parentId?: string) => void
}

export function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment)
      setNewComment("")
    }
  }

  const handleReply = (commentId: string) => {
    if (replyContent.trim()) {
      onAddComment(replyContent, commentId)
      setReplyContent("")
      setReplyingTo(null)
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`flex gap-3 ${isReply ? "ml-12 mt-3" : ""}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
        <AvatarFallback>{comment.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: pl })}
            </span>
          </div>
          <p className="text-sm text-foreground">{comment.content}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
            <ThumbsUp className="h-3 w-3" />
            <span>{comment.likes}</span>
          </button>
          {!isReply && (
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Reply className="h-3 w-3" />
              <span>Odpowiedz</span>
            </button>
          )}
        </div>
        {replyingTo === comment.id && (
          <div className="flex gap-2 mt-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Napisz odpowiedź..."
              rows={2}
              className="text-sm"
            />
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={() => handleReply(comment.id)}>
                Wyślij
              </Button>
              <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                Anuluj
              </Button>
            </div>
          </div>
        )}
        {comment.replies?.map((reply) => (
          <CommentItem key={reply.id} comment={reply} isReply />
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Dodaj komentarz..."
          rows={3}
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!newComment.trim()}>
            Dodaj komentarz
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
