"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { profileService } from "@/services/profileService";
import { useAuthStore } from "@/store/authStore";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardTitle } from "@/components/ui/Card";
import { PageSpinner } from "@/components/ui/Spinner";
import { Camera, Plus, X, Save, Award, FileCheck, Upload } from "lucide-react";


const profileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.userId],
    queryFn: () => profileService.getProfileByUserId(user!.userId),
    enabled: !!user,
  });

  // onSuccess was removed in TanStack Query v5 — initialize form via useEffect
  useEffect(() => {
    if (profile) {
      if (profile.skills) setSkills(profile.skills);
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        headline: profile.headline || "",
        bio: profile.bio || "",
        location: profile.location || "",
      });
    }
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormData) =>
      profileService.updateProfile(profile!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const skillsMutation = useMutation({
    mutationFn: (newSkills: string[]) =>
      profileService.updateSkills(profile!.id, newSkills),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  const picMutation = useMutation({
    mutationFn: (file: File) => profileService.uploadProfilePicture(profile!.id, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  const resumeMutation = useMutation({
    mutationFn: (file: File) => profileService.uploadResume(profile!.id, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  const certsMutation = useMutation({
    mutationFn: (files: File[]) => profileService.uploadCertificates(profile!.id, files),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()];
      setSkills(newSkills);
      skillsMutation.mutate(newSkills);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = skills.filter((s) => s !== skill);
    setSkills(newSkills);
    skillsMutation.mutate(newSkills);
  };

  if (isLoading) return <PageSpinner />;

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : "";

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Edit Profile</h1>
        {saveSuccess && (
          <span className="text-sm text-green-400 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-xl">
            ✓ Saved successfully
          </span>
        )}
      </div>

      {/* Profile Picture */}
      <Card>
        <CardTitle className="mb-4">Profile Picture</CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar name={fullName} src={profile?.profilePictureUrl} size="xl" />
            <label className="absolute bottom-0 right-0 w-7 h-7 bg-violet rounded-full flex items-center justify-center cursor-pointer hover:bg-violet-light transition-colors">
              <Camera size={14} className="text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) picMutation.mutate(file);
                }}
              />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Upload a photo</p>
            <p className="text-xs text-text-muted mt-1">JPG, PNG or GIF. Max 5MB.</p>
            {picMutation.isPending && (
              <p className="text-xs text-violet mt-1">Uploading...</p>
            )}
          </div>
        </div>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardTitle className="mb-4">Basic Information</CardTitle>
        <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" error={errors.firstName?.message} {...register("firstName")} />
            <Input label="Last Name" error={errors.lastName?.message} {...register("lastName")} />
          </div>
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input label="Headline" placeholder="e.g. Senior Software Engineer at Google" error={errors.headline?.message} {...register("headline")} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Bio</label>
            <textarea
              {...register("bio")}
              rows={4}
              placeholder="Tell people about yourself..."
              className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet/30 transition-all"
            />
          </div>
          <Input label="Location" placeholder="e.g. Mumbai, India" error={errors.location?.message} {...register("location")} />

          <Button type="submit" loading={updateMutation.isPending || isSubmitting}>
            <Save size={14} />
            Save Changes
          </Button>
        </form>
      </Card>

      {/* Skills */}
      <Card>
        <CardTitle className="mb-4">Skills</CardTitle>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet/20 text-violet-light border border-violet/30 rounded-full text-sm"
            >
              {skill}
              <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            placeholder="Add a skill..."
            className="flex-1 bg-bg-elevated border border-border rounded-xl px-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet/30 transition-all"
          />
          <Button onClick={addSkill} variant="outline" size="sm">
            <Plus size={14} />
            Add
          </Button>
        </div>
      </Card>

      {/* Resume Upload */}
      <Card>
        <CardTitle className="mb-4">Resume</CardTitle>
        <div className="flex items-center gap-4">
          {profile?.resumeUrl ? (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-violet hover:text-violet-light transition-colors"
            >
              View current resume ↗
            </a>
          ) : (
            <p className="text-sm text-text-muted">No resume uploaded yet</p>
          )}
          <label className="cursor-pointer">
            <span className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 bg-bg-elevated text-text-primary border border-border hover:border-violet hover:text-violet px-3 py-1.5 text-xs cursor-pointer">
              {resumeMutation.isPending ? "Uploading..." : "Upload Resume"}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) resumeMutation.mutate(file);
              }}
            />
          </label>
        </div>
      </Card>

      {/* Certificates Upload */}
      <Card>
        <CardTitle className="mb-4 flex items-center gap-2">
          <Award size={18} className="text-violet" />
          Certificates
        </CardTitle>

        {/* Existing certificates */}
        {profile?.certificates && profile.certificates.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.certificates.map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan/10 text-cyan border border-cyan/30 rounded-xl text-xs hover:bg-cyan/20 transition-colors"
              >
                <FileCheck size={12} />
                Certificate {idx + 1} ↗
              </a>
            ))}
          </div>
        )}

        {/* Upload new certificates */}
        <div className="flex items-center gap-3">
          <label className="cursor-pointer flex-1">
            <div className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-xl hover:border-violet/50 hover:bg-violet/5 transition-all">
              <Upload size={16} className="text-text-muted" />
              <span className="text-sm text-text-muted">
                {certsMutation.isPending
                  ? "Uploading..."
                  : "Click to select certificates (PDF, JPG, PNG)"}
              </span>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0 && profile) {
                  certsMutation.mutate(files);
                  e.target.value = "";
                }
              }}
            />
          </label>
        </div>

        {certsMutation.isSuccess && (
          <p className="text-xs text-green-400 mt-2">
            ✓ {certsMutation.data?.length} certificate(s) uploaded successfully
          </p>
        )}
      </Card>
    </div>
  );
}
