import api from "./api";
import {
  Job,
  CreateJobRequest,
  UpdateJobRequest,
  Application,
  CreateApplicationRequest,
  UpdateStatusRequest,
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "@/types";

// ========================= JOBS =========================
export const jobService = {
  createJob: async (data: CreateJobRequest): Promise<Job> => {
    const res = await api.post<Job>("/api/jobs/create", data);
    return res.data;
  },

  getAllJobs: async (filters?: {
    status?: string;
    location?: string;
    employmentType?: string;
    experienceLevel?: string;
  }): Promise<Job[]> => {
    const res = await api.get<Job[]>("/api/jobs/getall", { params: filters });
    return res.data;
  },

  getJobById: async (jobId: number): Promise<Job> => {
    const res = await api.get<Job>(`/api/jobs/${jobId}`);
    return res.data;
  },

  updateJob: async (jobId: number, data: UpdateJobRequest): Promise<Job> => {
    const res = await api.put<Job>(`/api/jobs/${jobId}`, data);
    return res.data;
  },

  deleteJob: async (jobId: number): Promise<void> => {
    await api.delete(`/api/jobs/${jobId}`);
  },

  getJobsByRecruiter: async (recruiterId: number): Promise<Job[]> => {
    const res = await api.get<Job[]>(`/api/jobs/recruiter/${recruiterId}`);
    return res.data;
  },

  searchJobs: async (keyword1: string, keyword2: string): Promise<Job[]> => {
    const res = await api.get<Job[]>("/api/jobs/search", {
      params: { keyword1, keyword2 },
    });
    return res.data;
  },

  closeJob: async (jobId: number): Promise<Job> => {
    const res = await api.patch<Job>(`/api/jobs/${jobId}/close`);
    return res.data;
  },
};

// ========================= APPLICATIONS =========================
export const applicationService = {
  applyForJob: async (data: CreateApplicationRequest): Promise<Application> => {
    const res = await api.post<Application>("/api/jobs/applications", data);
    return res.data;
  },

  getApplicationsByJob: async (jobId: number): Promise<Application[]> => {
    const res = await api.get<Application[]>(`/api/jobs/applications/job/${jobId}`);
    return res.data;
  },

  getApplicationsByCandidate: async (candidateId: number): Promise<Application[]> => {
    const res = await api.get<Application[]>(`/api/jobs/applications/candidate/${candidateId}`);
    return res.data;
  },

  updateApplicationStatus: async (
    applicationId: number,
    data: UpdateStatusRequest
  ): Promise<Application> => {
    const res = await api.patch<Application>(
      `/api/jobs/applications/${applicationId}/status`,
      data
    );
    return res.data;
  },

  withdrawApplication: async (applicationId: number): Promise<void> => {
    await api.delete(`/api/jobs/applications/${applicationId}`);
  },
};

// ========================= COMPANIES =========================
export const companyService = {
  createCompany: async (data: CreateCompanyRequest): Promise<Company> => {
    const res = await api.post<Company>("/api/jobs/companies/createCompany", data);
    return res.data;
  },

  getAllCompanies: async (): Promise<Company[]> => {
    const res = await api.get<Company[]>("/api/jobs/companies");
    return res.data;
  },

  getCompanyById: async (companyId: number): Promise<Company> => {
    const res = await api.get<Company>(`/api/jobs/companies/${companyId}`);
    return res.data;
  },

  updateCompany: async (
    companyId: number,
    data: UpdateCompanyRequest
  ): Promise<Company> => {
    const res = await api.put<Company>(`/api/jobs/companies/${companyId}`, data);
    return res.data;
  },

  deleteCompany: async (companyId: number): Promise<void> => {
    await api.delete(`/api/jobs/companies/${companyId}`);
  },

  getJobsByCompany: async (companyId: number): Promise<Job[]> => {
    const res = await api.get<Job[]>(`/api/jobs/companies/${companyId}/jobs`);
    return res.data;
  },
};
