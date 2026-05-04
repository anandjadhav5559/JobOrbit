"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profileService";
import { connectionService } from "@/services/connectionService";
import { useAuthStore } from "@/store/authStore";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { MapPin, Link2, Briefcase, GraduationCap, Award, Edit, MessageSquare, UserPlus, UserCheck, FileText } from "lucide-react";
import { formatDateRange } from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";

interface ProfilePageProps {
  params: { id: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const profileId = parseInt(params.id);
  const isOwn = user?.userId === profileId;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", profileId],
    queryFn: () => profileService.getProfile(profileId),
  });

  const { data: isConnected } = useQuery({
    queryKey: ["connection-check", profileId],
    queryFn: () => connectionService.checkConnection(profileId),
    enabled: !isOwn && !!user,
  });

  const connectMutation = useMutation({
    mutationFn: () => connectionService.sendRequest(profileId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["connection-check", profileId] }),
  });

  if (isLoading) return <ProfileSkeleton />;
  if (!profile) return (
    <div className="text-center py-20 text-text-muted">Profile not found</div>
  );

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header card */}
      <Card padding="none" className="overflow-hidden">
        {/* Banner */}
        <div className="h-36 bg-gradient-to-r from-violet/30 via-bg-elevated to-cyan/20" />

        <div className="px-6 pb-6">
          {/* Avatar + actions row */}
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              <Avatar
                name={fullName}
                src={profile.profilePictureUrl}
                size="xl"
                className="border-4 border-bg-card"
              />
            </div>

            <div className="flex items-center gap-2 mt-14">
              {isOwn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(ROUTES.PROFILE_EDIT)}
                >
                  <Edit size={14} />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push(ROUTES.CHAT_USER(profileId))}
                  >
                    <MessageSquare size={14} />
                    Message
                  </Button>
                  {isConnected ? (
                    <Button variant="outline" size="sm" disabled>
                      <UserCheck size={14} />
                      Connected
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      loading={connectMutation.isPending}
                      onClick={() => connectMutation.mutate()}
                    >
                      <UserPlus size={14} />
                      Connect
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Name & headline */}
          <h1 className="text-2xl font-bold text-text-primary">{fullName}</h1>
          {profile.headline && (
            <p className="text-text-secondary mt-1">{profile.headline}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-text-muted">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {profile.location}
              </span>
            )}
            {profile.email && (
              <span className="flex items-center gap-1">
                <Link2 size={14} />
                {profile.email}
              </span>
            )}
          </div>

          {profile.bio && (
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">{profile.bio}</p>
          )}

          {/* Resume download */}
          {profile.resumeUrl && (
            <div className="mt-4">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-violet hover:text-violet-light transition-colors"
              >
                <FileText size={14} />
                View Resume
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <Card>
          <CardTitle className="mb-4 flex items-center gap-2">
            <Award size={18} className="text-violet" />
            Skills
          </CardTitle>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <Badge key={i} variant="violet">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <Card>
          <CardTitle className="mb-4 flex items-center gap-2">
            <Briefcase size={18} className="text-cyan" />
            Experience
          </CardTitle>
          <CardContent>
            <div className="space-y-4">
              {profile.experience.map((exp, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center shrink-0">
                    <Briefcase size={18} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{exp.title}</p>
                    <p className="text-sm text-text-secondary">{exp.company}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-text-muted mt-1">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <Card>
          <CardTitle className="mb-4 flex items-center gap-2">
            <GraduationCap size={18} className="text-orange-400" />
            Education
          </CardTitle>
          <CardContent>
            <div className="space-y-4">
              {profile.education.map((edu, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center shrink-0">
                    <GraduationCap size={18} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{edu.institution}</p>
                    <p className="text-sm text-text-secondary">{edu.degree} in {edu.field}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {edu.startYear} – {edu.endYear || "Present"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certificates */}
      {profile.certificates && profile.certificates.length > 0 && (
        <Card>
          <CardTitle className="mb-4 flex items-center gap-2">
            <Award size={18} className="text-yellow-400" />
            Certificates
          </CardTitle>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {profile.certificates.map((cert, i) => (
                <a
                  key={i}
                  href={cert}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl bg-bg-elevated border border-border hover:border-violet/50 transition-colors text-sm text-text-secondary"
                >
                  <Award size={14} className="text-yellow-400 shrink-0" />
                  Certificate {i + 1}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
