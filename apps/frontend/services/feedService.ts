import api from "./api";
import {
  Post,
  PageResponseDTO,
  Comment,
} from "@/types";

export const feedService = {
  createPost: async (content: string, file?: File): Promise<Post> => {
    const form = new FormData();
    if (content) form.append("content", content);
    if (file) form.append("file", file);
    const res = await api.post<Post>("/api/feed", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  getFeed: async (page = 0, size = 10): Promise<PageResponseDTO<Post>> => {
    const res = await api.get<PageResponseDTO<Post>>("/api/feed", {
      params: { page, size },
    });
    return res.data;
  },

  searchPosts: async (keyword: string, page = 0, size = 10): Promise<PageResponseDTO<Post>> => {
    const res = await api.get<PageResponseDTO<Post>>("/api/feed/search", {
      params: { keyword, page, size },
    });
    return res.data;
  },

  toggleLike: async (postId: number): Promise<string> => {
    const res = await api.post<string>(`/api/feed/${postId}/like`);
    return res.data;
  },

  sharePost: async (postId: number): Promise<Post> => {
    const res = await api.post<Post>(`/api/feed/${postId}/share`);
    return res.data;
  },

  toggleSave: async (postId: number): Promise<string> => {
    const res = await api.post<string>(`/api/feed/${postId}/save`);
    return res.data;
  },

  addComment: async (postId: number, content: string): Promise<Comment> => {
    const res = await api.post<Comment>(`/api/feed/${postId}/comment`, { content });
    return res.data;
  },

  deletePost: async (postId: number): Promise<string> => {
    const res = await api.delete<string>(`/api/feed/${postId}`);
    return res.data;
  },

  getSavedPosts: async (page = 0, size = 10): Promise<PageResponseDTO<Post>> => {
    const res = await api.get<PageResponseDTO<Post>>("/api/feed/saved", {
      params: { page, size },
    });
    return res.data;
  },
};
