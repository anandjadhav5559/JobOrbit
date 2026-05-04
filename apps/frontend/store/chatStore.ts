import { create } from "zustand";
import { ChatMessage, ChatConversation } from "@/types";

interface ChatState {
  conversations: ChatConversation[];
  activeConversation: string | null;
  messages: Record<string, ChatMessage[]>;
  unreadCounts: Record<string, number>;
  connected: boolean;

  setActiveConversation: (userId: string | null) => void;
  addMessage: (userId: string, message: ChatMessage) => void;
  setMessages: (userId: string, messages: ChatMessage[]) => void;
  setConversations: (convs: ChatConversation[]) => void;
  setConnected: (connected: boolean) => void;
  markRead: (userId: string) => void;
  incrementUnread: (userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversation: null,
  messages: {},
  unreadCounts: {},
  connected: false,

  setActiveConversation: (userId) => set({ activeConversation: userId }),

  addMessage: (userId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [userId]: [...(state.messages[userId] || []), message],
      },
    })),

  setMessages: (userId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [userId]: messages },
    })),

  setConversations: (convs) => set({ conversations: convs }),

  setConnected: (connected) => set({ connected }),

  markRead: (userId) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [userId]: 0 },
    })),

  incrementUnread: (userId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      },
    })),
}));
