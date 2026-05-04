"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { connectionService } from "@/services/connectionService";
import { profileService } from "@/services/profileService";
import { useAuthStore } from "@/store/authStore";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageSpinner } from "@/components/ui/Spinner";
import { MessageSquare, UserCheck, UserX, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";
import { Profile } from "@/types";

export default function ConnectionsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: connectionIds, isLoading } = useQuery({
    queryKey: ["connections"],
    queryFn: () => connectionService.getMyConnections(),
    enabled: !!user,
  });

  const { data: allProfiles } = useQuery({
    queryKey: ["all-profiles"],
    queryFn: () => profileService.getAllProfiles(),
  });

  const acceptMutation = useMutation({
    mutationFn: (senderId: number) => connectionService.acceptRequest(senderId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["connections"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (senderId: number) => connectionService.rejectRequest(senderId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["connections"] }),
  });

  const connectMutation = useMutation({
    mutationFn: (receiverId: number) => connectionService.sendRequest(receiverId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["connections"] }),
  });

  if (isLoading) return <PageSpinner />;

  const connectedIds = new Set(connectionIds || []);
  const myConnections = (allProfiles || []).filter((p: Profile) =>
    connectedIds.has(p.userId) && p.userId !== user?.userId
  );
  const suggestions = (allProfiles || []).filter((p: Profile) =>
    !connectedIds.has(p.userId) && p.userId !== user?.userId
  ).slice(0, 12);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* My Connections */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          My Network
          <span className="ml-2 text-sm font-normal text-text-muted">
            ({myConnections.length} connections)
          </span>
        </h1>

        {myConnections.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-text-muted">No connections yet. Start growing your network!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {myConnections.map((profile: Profile) => (
              <Card key={profile.id} hover padding="md" className="flex items-center gap-3">
                <Avatar
                  name={`${profile.firstName} ${profile.lastName}`}
                  src={profile.profilePictureUrl}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => router.push(ROUTES.PROFILE(profile.id))}
                    className="font-medium text-text-primary text-sm hover:text-violet transition-colors truncate block"
                  >
                    {profile.firstName} {profile.lastName}
                  </button>
                  {profile.headline && (
                    <p className="text-xs text-text-muted truncate">{profile.headline}</p>
                  )}
                </div>
                <button
                  onClick={() => router.push(ROUTES.CHAT_USER(profile.userId))}
                  className="p-2 rounded-lg text-text-muted hover:text-cyan hover:bg-cyan/10 transition-colors shrink-0"
                >
                  <MessageSquare size={16} />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">People You May Know</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((profile: Profile) => (
              <Card key={profile.id} padding="md">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar
                    name={`${profile.firstName} ${profile.lastName}`}
                    src={profile.profilePictureUrl}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => router.push(ROUTES.PROFILE(profile.id))}
                      className="font-medium text-text-primary text-sm hover:text-violet transition-colors truncate block text-left"
                    >
                      {profile.firstName} {profile.lastName}
                    </button>
                    {profile.headline && (
                      <p className="text-xs text-text-muted truncate">{profile.headline}</p>
                    )}
                    {profile.location && (
                      <p className="text-xs text-text-muted">{profile.location}</p>
                    )}
                  </div>
                </div>
                <Button
                  fullWidth
                  variant="outline"
                  size="sm"
                  onClick={() => connectMutation.mutate(profile.userId)}
                  loading={connectMutation.isPending}
                >
                  <UserPlus size={14} />
                  Connect
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
