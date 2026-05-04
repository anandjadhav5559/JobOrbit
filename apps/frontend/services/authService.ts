import api from "./api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  ForgetPasswordRequest,
  ResetPasswordRequest,
} from "@/types";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/api/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<string> => {
    const res = await api.post<string>("/api/auth/register", data);
    return res.data;
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/api/auth/verify-otp", data);
    return res.data;
  },

  resendOtp: async (data: ResendOtpRequest): Promise<string> => {
    const res = await api.post<string>("/api/auth/resend-otp", data);
    return res.data;
  },

  forgotPassword: async (data: ForgetPasswordRequest): Promise<string> => {
    const res = await api.post<string>("/api/auth/forgot-password", data);
    return res.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<string> => {
    const res = await api.post<string>("/api/auth/reset-password", data);
    return res.data;
  },

  refresh: async (): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/api/auth/refresh");
    return res.data;
  },

  logout: async (): Promise<void> => {
    // Clear local state — backend uses cookie-based refresh token
    if (typeof window !== "undefined") {
      localStorage.removeItem("joborbit_auth");
    }
  },
};
