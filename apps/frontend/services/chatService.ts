import api from "./api";
import { ChatMessage } from "@/types";

export const chatService = {
  getConversation: async (otherUserId: string): Promise<ChatMessage[]> => {
    const res = await api.get<ChatMessage[]>(`/api/chat/conversation/${otherUserId}`);
    return res.data;
  },

  getUnreadMessages: async (): Promise<ChatMessage[]> => {
    const res = await api.get<ChatMessage[]>("/api/chat/unread");
    return res.data;
  },

  markAsRead: async (senderId: string): Promise<void> => {
    await api.put(`/api/chat/read/${senderId}`);
  },

  isOnline: async (userId: string): Promise<boolean> => {
    const res = await api.get<boolean>(`/api/chat/status/${userId}`);
    return res.data;
  },
};
