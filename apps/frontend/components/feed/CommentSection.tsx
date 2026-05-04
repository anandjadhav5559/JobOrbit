"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { feedService } from "@/services/feedService";
import { useAuthStore } from "@/store/authStore";
import Avatar from "@/components/ui/Avatar";
import { Comment } from "@/types";
import { formatRelativeTime } from "@/utils/formatDate";

interface CommentSectionProps {
  postId: number;
  commentCount: number;
}

export default function CommentSection({ postId, commentCount }: CommentSectionProps) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  const mutation = useMutation({
    mutationFn: () => feedService.addComment(postId, text),
    onSuccess: (comment) => {
      setComments((prev) => [...prev, comment]);
      setText("");
    },
  });

  return (
    <div className="px-5 pb-4 space-y-3 border-t border-border/50 pt-3">
      {/* Comment list */}
      {comments.map((c) => (
        <div key={c.id} className="flex items-start gap-2">
          <Avatar name={c.authorName} src={c.authorProfilePic} size="xs" />
          <div className="flex-1 bg-bg-elevated rounded-xl px-3 py-2">
            <p className="text-xs font-semibold text-text-primary">{c.authorName}</p>
            <p className="text-xs text-text-secondary mt-0.5">{c.content}</p>
          </div>
          <span className="text-xs text-text-muted mt-2 shrink-0">
            {formatRelativeTime(c.createdAt)}
          </span>
        </div>
      ))}

      {/* Input */}
      <div className="flex items-center gap-2">
        <Avatar name={user?.email} size="xs" />
        <div className="flex-1 flex items-center gap-2 bg-bg-elevated border border-border rounded-xl px-3 py-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && text.trim()) mutation.mutate();
            }}
            placeholder="Write a comment..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <button
            onClick={() => text.trim() && mutation.mutate()}
            disabled={!text.trim() || mutation.isPending}
            className="text-violet hover:text-violet-light transition-colors disabled:opacity-40"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
