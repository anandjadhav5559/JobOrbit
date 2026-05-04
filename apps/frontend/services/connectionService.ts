import api from "./api";

export const connectionService = {
  sendRequest: async (receiverId: number): Promise<string> => {
    const res = await api.post<string>(`/api/connections/request/${receiverId}`);
    return res.data;
  },

  acceptRequest: async (senderId: number): Promise<string> => {
    const res = await api.post<string>(`/api/connections/accept/${senderId}`);
    return res.data;
  },

  rejectRequest: async (senderId: number): Promise<string> => {
    const res = await api.post<string>(`/api/connections/reject/${senderId}`);
    return res.data;
  },

  getMyConnections: async (): Promise<number[]> => {
    const res = await api.get<number[]>("/api/connections");
    return res.data;
  },

  checkConnection: async (otherUserId: number): Promise<boolean> => {
    const res = await api.get<boolean>(`/api/connections/check/${otherUserId}`);
    return res.data;
  },
};
