"use client";

import { useRef, useCallback, useEffect } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { ChatMessage } from "@/types";
import { WS_URL } from "@/utils/constants";

let stompClient: Client | null = null;

export const useWebSocket = () => {
  const { setConnected, addMessage, activeConversation } = useChatStore();
  const { user } = useAuthStore();
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const connect = useCallback(() => {
    if (stompClient?.connected || !user) return;

    stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as WebSocket,
      connectHeaders: {
        Authorization: `Bearer ${user.accessToken}`,
        userId: String(user.userId),
      },
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        // Subscribe to personal message queue
        subscriptionRef.current = stompClient!.subscribe(
          `/user/${user.userId}/queue/messages`,
          (message: IMessage) => {
            try {
              const msg: ChatMessage = JSON.parse(message.body);
              const partnerId =
                msg.senderId === String(user.userId) ? msg.receiverId : msg.senderId;
              addMessage(partnerId, msg);
            } catch {
              // ignore parse errors
            }
          }
        );
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
        setConnected(false);
      },
    });

    stompClient.activate();
  }, [user, setConnected, addMessage]);

  const disconnect = useCallback(() => {
    subscriptionRef.current?.unsubscribe();
    stompClient?.deactivate();
    stompClient = null;
    setConnected(false);
  }, [setConnected]);

  const sendMessage = useCallback((message: ChatMessage) => {
    if (!stompClient?.connected) {
      console.warn("STOMP not connected");
      return;
    }
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(message),
    });
  }, []);

  useEffect(() => {
    if (user) connect();
    return () => {
      disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  return { connect, disconnect, sendMessage };
};
