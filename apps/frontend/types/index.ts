// ========================= AUTH =========================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "CANDIDATE" | "RECRUITER";
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  role: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

// ========================= PROFILE =========================
export interface Profile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  headline?: string;
  bio?: string;
  location?: string;
  profilePictureUrl?: string;
  resumeUrl?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  certificates?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  id?: number;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  description?: string;
  current?: boolean;
}

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
}

export interface ProfileAddDTO {
  firstName: string;
  lastName: string;
  email: string;
  headline?: string;
  bio?: string;
  location?: string;
}

export interface ProfileUpdateDTO extends ProfileAddDTO {}

// ========================= CONNECTIONS =========================
export type ConnectionStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "NONE";

export interface ConnectionCheck {
  connected: boolean;
}

// ========================= FEED =========================
export interface Post {
  id: number;
  userId: number;
  authorName: string;
  authorProfilePic?: string;
  content: string;
  mediaUrl?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  liked: boolean;
  saved: boolean;
  createdAt: string;
  updatedAt?: string;
  shared?: boolean;
  originalPostId?: number;
}

export interface PostResponseDTO extends Post {}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  authorName: string;
  authorProfilePic?: string;
  content: string;
  createdAt: string;
}

export interface CommentRequest {
  content: string;
}

export interface PageResponseDTO<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// ========================= CHAT =========================
export interface ChatMessage {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: string;
  read?: boolean;
  type?: "TEXT" | "IMAGE" | "FILE";
}

export interface ChatConversation {
  userId: string;
  userName: string;
  profilePic?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  online?: boolean;
}

// ========================= JOBS =========================
export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE";
  experienceLevel: "ENTRY" | "MID" | "SENIOR" | "LEAD" | "MANAGER";
  status: "OPEN" | "CLOSED" | "DRAFT";
  salary?: string;
  skills?: string[];
  companyId?: number;
  companyName?: string;
  companyLogo?: string;
  recruiterId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  companyId?: number;
  salary?: string;
  skills?: string[];
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  status?: string;
}

// ========================= APPLICATIONS =========================
export interface Application {
  id: number;
  jobId: number;
  jobTitle?: string;
  companyName?: string;
  candidateId: number;
  candidateName?: string;
  status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "ACCEPTED";
  coverLetter?: string;
  appliedAt: string;
  updatedAt?: string;
}

export interface CreateApplicationRequest {
  jobId: number;
  coverLetter?: string;
}

export interface UpdateStatusRequest {
  status: string;
}

// ========================= COMPANY =========================
export interface Company {
  id: number;
  name: string;
  description?: string;
  website?: string;
  location?: string;
  industry?: string;
  logoUrl?: string;
  ownerId: number;
  createdAt?: string;
}

export interface CreateCompanyRequest {
  name: string;
  description?: string;
  website?: string;
  location?: string;
  industry?: string;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {}

// ========================= COMMON =========================
export interface ApiError {
  message: string;
  status: number;
  timestamp?: string;
}

export interface AuthUser {
  userId: number;
  email: string;
  role: "CANDIDATE" | "RECRUITER" | "ADMIN";
  accessToken: string;
  profileId?: number;
}
