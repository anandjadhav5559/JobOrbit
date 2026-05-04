"use client";

import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/services/chatService";
import { profileService } from "@/services/profileService";
import { useAuthStore } from "@/store/authStore";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageSpinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";
import { formatRelativeTime } from "@/utils/formatDate";
import { MessageSquare } from "lucide-react";

export default function ChatListPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const { data: unread, isLoading } = useQuery({
    queryKey: ["unread-messages"],
    queryFn: () => chatService.getUnreadMessages(),
    enabled: !!user,
    refetchInterval: 10000, // poll every 10s
  });

  // Get unique sender IDs from unread messages
  const unreadSenders = [...new Set((unread || []).map((m) => m.senderId))];

  if (isLoading) return <PageSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Messages</h1>

      {unreadSenders.length === 0 ? (
        <Card className="text-center py-16">
          <MessageSquare size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No messages yet</h3>
          <p className="text-text-muted text-sm">
            Connect with people and start a conversation!
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {unreadSenders.map((senderId) => {
            const count = (unread || []).filter((m) => m.senderId === senderId).length;
            const lastMsg = (unread || []).filter((m) => m.senderId === senderId).at(-1);

            return (
              <button
                key={senderId}
                onClick={() => router.push(ROUTES.CHAT_USER(senderId))}
                className="w-full"
              >
                <Card hover padding="md" className="flex items-center gap-3 text-left">
                  <Avatar name={`User ${senderId}`} size="md" online />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-text-primary text-sm">User {senderId}</p>
                      {lastMsg?.timestamp && (
                        <span className="text-xs text-text-muted">
                          {formatRelativeTime(lastMsg.timestamp)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted truncate mt-0.5">
                      {lastMsg?.content || "New message"}
                    </p>
                  </div>
                  {count > 0 && (
                    <Badge variant="violet" className="shrink-0">
                      {count}
                    </Badge>
                  )}
                </Card>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
