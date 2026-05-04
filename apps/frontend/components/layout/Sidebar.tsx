"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  Users,
  MessageSquare,
  Briefcase,
  Building2,
  FileText,
  Bookmark,
  User,
  LayoutDashboard,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { chatService } from "@/services/chatService";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/utils/constants";

const navItems = [
  { href: ROUTES.FEED, icon: Home, label: "Feed" },
  { href: ROUTES.CONNECTIONS, icon: Users, label: "Network" },
  { href: ROUTES.CHAT, icon: MessageSquare, label: "Messages", badge: "unread" },
  { href: ROUTES.JOBS, icon: Briefcase, label: "Jobs" },
  { href: ROUTES.COMPANIES, icon: Building2, label: "Companies" },
  { href: ROUTES.APPLICATIONS, icon: FileText, label: "Applications", roles: ["CANDIDATE"] },
  { href: ROUTES.JOBS_SAVED, icon: Bookmark, label: "Saved" },
  { href: "/recruiter", icon: LayoutDashboard, label: "Dashboard", roles: ["RECRUITER"] },
] as const;

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobile = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Live unread count
  const { data: unread } = useQuery({
    queryKey: ["unread-messages"],
    queryFn: () => chatService.getUnreadMessages(),
    enabled: !!user,
    refetchInterval: 15000,
    staleTime: 10000,
  });
  const unreadCount = unread?.length ?? 0;

  const filteredItems = navItems.filter(
    (item) => !("roles" in item && item.roles) || (user?.role && (item.roles as readonly string[]).includes(user.role))
  );

  return (
    <aside
      className={cn(
        "flex flex-col h-full py-4",
        mobile ? "w-full" : "w-56"
      )}
    >
      {/* Profile quick-link */}
      <div className="px-3 mb-4">
        <Link
          href={ROUTES.PROFILE(user?.userId || "")}
          onClick={onClose}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-elevated transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {user?.email?.split("@")[0]}
            </p>
            <p className="text-xs text-text-muted capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        </Link>
      </div>

      <div className="h-px bg-border mx-3 mb-3" />

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-0.5">
        {filteredItems.map(({ href, icon: Icon, label, ...rest }) => {
          const badge = "badge" in rest ? rest.badge : undefined;
          const isActive = pathname === href || pathname.startsWith(href + "/");
          const showBadge = badge === "unread" && unreadCount > 0;

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-violet/15 text-violet-light border border-violet/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-violet" : "text-text-muted"
                )}
              />
              {label}
              <span className="ml-auto flex items-center gap-1.5">
                {showBadge && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-violet text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                {isActive && !showBadge && (
                  <span className="w-1.5 h-1.5 rounded-full bg-violet" />
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom tag */}
      <div className="px-4 mt-4">
        <div className="rounded-xl bg-gradient-to-br from-violet/10 to-cyan/10 border border-violet/20 p-3 text-center">
          <p className="text-xs text-text-muted">
            <span className="gradient-text font-semibold">JobOrbit</span>
            <br />
            Explore. Apply. Grow.
          </p>
        </div>
      </div>
    </aside>
  );
}
