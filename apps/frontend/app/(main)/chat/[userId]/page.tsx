"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { chatService } from "@/services/chatService";
import { useWebSocket } from "@/services/websocketService";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import Avatar from "@/components/ui/Avatar";
import { Send, ChevronLeft, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "@/utils/formatDate";
import { ChatMessage } from "@/types";
import { motion } from "framer-motion";

interface ChatWindowPageProps {
  params: { userId: string };
}

export default function ChatWindowPage({ params }: ChatWindowPageProps) {
  const otherUserId = params.userId;
  const { user } = useAuthStore();
  const router = useRouter();
  const { messages, setMessages, addMessage, activeConversation, setActiveConversation, connected } =
    useChatStore();
  const { sendMessage } = useWebSocket();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Set active conversation
  useEffect(() => {
    setActiveConversation(otherUserId);
    return () => setActiveConversation(null);
  }, [otherUserId, setActiveConversation]);

  // Load conversation history
  const { isLoading } = useQuery({
    queryKey: ["conversation", otherUserId],
    queryFn: async () => {
      const msgs = await chatService.getConversation(otherUserId);
      setMessages(otherUserId, msgs);
      return msgs;
    },
    enabled: !!user,
  });

  // Mark as read on mount
  const markReadMutation = useMutation({
    mutationFn: () => chatService.markAsRead(otherUserId),
  });

  useEffect(() => {
    markReadMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[otherUserId]]);

  // Online status check
  const { data: isOnline } = useQuery({
    queryKey: ["online-status", otherUserId],
    queryFn: () => chatService.isOnline(otherUserId),
    refetchInterval: 15000,
  });

  const handleSend = () => {
    if (!text.trim() || !user) return;
    const msg: ChatMessage = {
      senderId: String(user.userId),
      receiverId: otherUserId,
      content: text.trim(),
      timestamp: new Date().toISOString(),
      type: "TEXT",
    };
    sendMessage(msg);
    // Optimistically add to local store
    addMessage(otherUserId, msg);
    setText("");
  };

  const conversation = messages[otherUserId] || [];

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-bg-card border border-border rounded-t-2xl">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <Avatar name={`User ${otherUserId}`} size="sm" online={isOnline} />
        <div>
          <p className="font-semibold text-text-primary text-sm">User {otherUserId}</p>
          <p className="text-xs text-text-muted flex items-center gap-1">
            <Circle
              size={6}
              className={isOnline ? "fill-green-400 text-green-400" : "fill-text-muted text-text-muted"}
            />
            {isOnline ? "Online" : "Offline"}
            {!connected && (
              <span className="ml-1 text-yellow-400">(Connecting...)</span>
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg-secondary border-x border-border">
        {isLoading && (
          <div className="text-center text-text-muted text-sm py-8">Loading messages...</div>
        )}

        {conversation.map((msg, idx) => {
          const isMe = msg.senderId === String(user?.userId);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <Avatar name={`User ${otherUserId}`} size="xs" />
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? "bg-gradient-brand text-white rounded-br-sm"
                    : "bg-bg-elevated text-text-primary border border-border rounded-bl-sm"
                }`}
              >
                <p>{msg.content}</p>
                {msg.timestamp && (
                  <p className={`text-xs mt-1 ${isMe ? "text-white/60" : "text-text-muted"}`}>
                    {formatRelativeTime(msg.timestamp)}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}

        {conversation.length === 0 && !isLoading && (
          <div className="text-center text-text-muted text-sm py-12">
            No messages yet. Say hello! 👋
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 bg-bg-card border border-t-0 border-border rounded-b-2xl">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet/30 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
