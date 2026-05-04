import api from "./api";
import {
  Profile,
  ProfileAddDTO,
  ProfileUpdateDTO,
} from "@/types";

export const profileService = {
  createProfile: async (dto: ProfileAddDTO): Promise<Profile> => {
    const res = await api.post<Profile>("/api/profiles/create", dto);
    return res.data;
  },

  getProfile: async (id: number): Promise<Profile> => {
    const res = await api.get<Profile>(`/api/profiles/${id}`);
    return res.data;
  },

  getProfileByUserId: async (userId: number): Promise<Profile> => {
    const res = await api.get<Profile>(`/api/profiles/user/${userId}`);
    return res.data;
  },

  getAllProfiles: async (): Promise<Profile[]> => {
    const res = await api.get<Profile[]>("/api/profiles");
    return res.data;
  },

  updateProfile: async (id: number, dto: ProfileUpdateDTO): Promise<Profile> => {
    const res = await api.put<Profile>(`/api/profiles/update/${id}`, dto);
    return res.data;
  },

  updateHeadline: async (id: number, headline: string): Promise<Profile> => {
    const res = await api.patch<Profile>(`/api/profiles/${id}/headline`, { headline });
    return res.data;
  },

  updateBio: async (id: number, bio: string): Promise<Profile> => {
    const res = await api.patch<Profile>(`/api/profiles/${id}/bio`, { bio });
    return res.data;
  },

  updateLocation: async (id: number, location: string): Promise<Profile> => {
    const res = await api.patch<Profile>(`/api/profiles/${id}/location`, { location });
    return res.data;
  },

  updateSkills: async (id: number, skills: string[]): Promise<Profile> => {
    const res = await api.patch<Profile>(`/api/profiles/${id}/skills`, { skills });
    return res.data;
  },

  updateExperience: async (id: number, experience: unknown[]): Promise<Profile> => {
    const res = await api.patch<Profile>(`/api/profiles/${id}/experience`, { experience });
    return res.data;
  },

  updateEducation: async (id: number, education: unknown[]): Promise<Profile> => {
    const res = await api.patch<Profile>(`/api/profiles/${id}/education`, { education });
    return res.data;
  },

  uploadProfilePicture: async (id: number, file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    const res = await api.post<string>(`/api/profiles/${id}/upload/profile-pic`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  uploadResume: async (id: number, file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    const res = await api.post<string>(`/api/profiles/${id}/upload/resume`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  uploadCertificates: async (id: number, files: File[]): Promise<string[]> => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const res = await api.post<string[]>(`/api/profiles/${id}/upload/certificates`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  deleteProfile: async (id: number): Promise<void> => {
    await api.delete(`/api/profiles/${id}`);
  },

  searchProfiles: async (skills?: string, location?: string): Promise<Profile[]> => {
    const res = await api.get<Profile[]>("/api/profiles/search", {
      params: { skills, location },
    });
    return res.data;
  },

  getByLocation: async (location: string): Promise<Profile[]> => {
    const res = await api.get<Profile[]>(`/api/profiles/location/${location}`);
    return res.data;
  },

  getBySkill: async (skill: string): Promise<Profile[]> => {
    const res = await api.get<Profile[]>(`/api/profiles/skill/${skill}`);
    return res.data;
  },
};
