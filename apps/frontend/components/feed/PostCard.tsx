"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Avatar from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Post } from "@/types";
import { feedService } from "@/services/feedService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatRelativeTime } from "@/utils/formatDate";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import CommentSection from "./CommentSection";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [saved, setSaved] = useState(post.saved);

  const likeMutation = useMutation({
    mutationFn: () => feedService.toggleLike(post.id),
    onMutate: () => {
      setLiked((prev) => !prev);
      setLikeCount((prev) => liked ? prev - 1 : prev + 1);
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => feedService.toggleSave(post.id),
    onMutate: () => setSaved((prev) => !prev),
  });

  const shareMutation = useMutation({
    mutationFn: () => feedService.sharePost(post.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => feedService.deletePost(post.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed"] }),
  });

  const isOwner = user?.userId === post.userId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card padding="none" className="overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="flex items-center gap-3">
            <Avatar
              name={post.authorName}
              src={post.authorProfilePic}
              size="md"
            />
            <div>
              <p className="font-semibold text-text-primary text-sm">{post.authorName}</p>
              <p className="text-xs text-text-muted">
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
              >
                <MoreHorizontal size={18} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 z-10 w-36 bg-bg-card border border-border rounded-xl shadow-card">
                  <button
                    onClick={() => { deleteMutation.mutate(); setShowMenu(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors rounded-xl"
                  >
                    <Trash2 size={14} />
                    Delete post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {post.content && (
          <div className="px-5 pb-3">
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        )}

        {/* Media */}
        {post.mediaUrl && (
          <div className="relative w-full aspect-video bg-bg-elevated">
            <Image
              src={post.mediaUrl}
              alt="Post media"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Stats */}
        <div className="px-5 py-2 flex items-center gap-4 text-xs text-text-muted border-t border-border/50">
          <span>{likeCount} likes</span>
          <span>{post.commentCount} comments</span>
          <span>{post.shareCount} shares</span>
        </div>

        {/* Actions */}
        <div className="px-3 pb-3 flex items-center gap-1 border-t border-border/50">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => likeMutation.mutate()}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
              liked
                ? "text-red-400 bg-red-500/10"
                : "text-text-muted hover:text-red-400 hover:bg-red-500/10"
            }`}
          >
            <Heart size={16} className={liked ? "fill-current" : ""} />
            Like
          </motion.button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-cyan hover:bg-cyan/10 transition-all flex-1 justify-center"
          >
            <MessageCircle size={16} />
            Comment
          </button>

          <button
            onClick={() => shareMutation.mutate()}
            disabled={shareMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-green-400 hover:bg-green-500/10 transition-all flex-1 justify-center disabled:opacity-50"
          >
            <Share2 size={16} />
            Share
          </button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => saveMutation.mutate()}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
              saved
                ? "text-violet bg-violet/10"
                : "text-text-muted hover:text-violet hover:bg-violet/10"
            }`}
          >
            <Bookmark size={16} className={saved ? "fill-current" : ""} />
            Save
          </motion.button>
        </div>

        {/* Comments */}
        {showComments && <CommentSection postId={post.id} commentCount={post.commentCount} />}
      </Card>
    </motion.div>
  );
}
