import React, { useState } from 'react';
import { Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CommentSectionProps {
  issueId: string;
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  currentUserId?: string;
}

export function CommentSection({ issueId, comments, onAddComment, currentUserId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment, replyTo || undefined);
      setNewComment('');
      setReplyTo(null);
    }
  };

  const parseMentions = (content: string) => {
    return content.replace(/@(\w+)/g, (match, username) => {
      return `<span class="mention" data-user="${username}">@${username}</span>`;
    });
  };

  // Grupowanie komentarzy w wątki
  const getCommentThreads = () => {
    const threads: { [key: string]: Comment[] } = {};
    comments.forEach(comment => {
      const parentId = comment.parentCommentId || comment.id;
      if (!threads[parentId]) threads[parentId] = [];
      threads[parentId].push(comment);
    });
    return threads;
  };

  const threads = getCommentThreads();

  return (
    <div className="space-y-4">
      {Object.entries(threads).map(([threadId, threadComments]) => (
        <div key={threadId} className="space-y-2">
          {threadComments
            .filter(comment => !comment.parentCommentId) // Tylko komentarze główne
            .map(comment => (
              <div key={comment.id} className="border-l-2 border-muted pl-4">
                <div className="flex items-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{comment.userId[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{comment.userId}</div>
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: parseMentions(comment.content) }}
                    />
                    <div className="flex gap-2 mt-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setReplyTo(comment.id)}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Odpowiedzi w wątku */}
                {threadComments
                  .filter(c => c.parentCommentId === comment.id)
                  .map(reply => (
                    <div key={reply.id} className="ml-8 mt-2 border-l-2 border-muted/50 pl-4">
                      <div className="flex items-start gap-2">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-xs">{reply.userId[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-xs font-medium">{reply.userId}</div>
                          <div
                            className="text-xs"
                            dangerouslySetInnerHTML={{ __html: parseMentions(reply.content) }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      ))}

      {replyTo && (
        <div className="ml-8 p-2 bg-muted rounded">
          <Textarea
            placeholder="Write a reply..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={handleSubmit}>Reply</Button>
            <Button size="sm" variant="outline" onClick={() => setReplyTo(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <Button onClick={handleSubmit} className="self-end">Comment</Button>
      </div>
    </div>
  );
}
