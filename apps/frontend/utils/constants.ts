export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws-chat";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_OTP: "/verify-otp",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  FEED: "/feed",
  PROFILE: (id: number | string) => `/profile/${id}`,
  PROFILE_EDIT: "/profile/edit",
  CONNECTIONS: "/connections",
  CHAT: "/chat",
  CHAT_USER: (userId: number | string) => `/chat/${userId}`,
  JOBS: "/jobs",
  JOB_DETAIL: (id: number | string) => `/jobs/${id}`,
  JOBS_SAVED: "/jobs/saved",
  APPLICATIONS: "/applications",
  COMPANIES: "/companies",
  COMPANY_DETAIL: (id: number | string) => `/companies/${id}`,
} as const;

export const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "REMOTE", label: "Remote" },
];

export const EXPERIENCE_LEVELS = [
  { value: "ENTRY", label: "Entry Level" },
  { value: "MID", label: "Mid Level" },
  { value: "SENIOR", label: "Senior Level" },
  { value: "LEAD", label: "Lead" },
  { value: "MANAGER", label: "Manager" },
];

export const APPLICATION_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "REVIEWED", label: "Reviewed" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ACCEPTED", label: "Accepted" },
];
