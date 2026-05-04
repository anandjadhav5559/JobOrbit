"use client";

import { useState } from "react";
import { Image as ImageIcon, Send, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { feedService } from "@/services/feedService";
import { useAuthStore } from "@/store/authStore";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";

export default function CreatePost() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const mutation = useMutation({
    mutationFn: () => feedService.createPost(content, file || undefined),
    onSuccess: () => {
      setContent("");
      setFile(null);
      setPreview(null);
      setExpanded(false);
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const canPost = content.trim().length > 0 || file !== null;

  return (
    <Card>
      <div className="flex items-start gap-3">
        <Avatar name={user?.email} size="md" />
        <div className="flex-1">
          <button
            onClick={() => setExpanded(true)}
            className={`w-full text-left px-4 py-3 bg-bg-elevated border border-border rounded-xl text-sm transition-all ${
              expanded ? "hidden" : "text-text-muted hover:border-violet/50 hover:text-text-primary"
            }`}
          >
            What&apos;s on your mind?
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <textarea
                  autoFocus
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share an update, post, or thought..."
                  rows={4}
                  className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet/30 transition-all"
                />

                {/* Image preview */}
                {preview && (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="rounded-xl max-h-64 object-cover w-full" />
                    <button
                      onClick={() => { setFile(null); setPreview(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer p-2 rounded-xl text-text-muted hover:text-cyan hover:bg-cyan/10 transition-colors">
                      <ImageIcon size={18} />
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setExpanded(false); setContent(""); setFile(null); setPreview(null); }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      disabled={!canPost}
                      loading={mutation.isPending}
                      onClick={() => mutation.mutate()}
                    >
                      <Send size={14} />
                      Post
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
