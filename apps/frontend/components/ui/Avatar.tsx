import { cn } from "@/utils/cn";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
}

const sizeMap = {
  xs: { container: "w-7 h-7", text: "text-xs", indicator: "w-2 h-2" },
  sm: { container: "w-9 h-9", text: "text-sm", indicator: "w-2.5 h-2.5" },
  md: { container: "w-11 h-11", text: "text-base", indicator: "w-3 h-3" },
  lg: { container: "w-16 h-16", text: "text-xl", indicator: "w-3.5 h-3.5" },
  xl: { container: "w-24 h-24", text: "text-3xl", indicator: "w-4 h-4" },
};

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0][0]?.toUpperCase() || "?";
}

function getGradient(name?: string): string {
  const gradients = [
    "from-violet to-cyan",
    "from-violet to-purple-400",
    "from-cyan to-blue-500",
    "from-orange-500 to-pink-500",
    "from-green-500 to-cyan",
  ];
  if (!name) return gradients[0];
  const idx = name.charCodeAt(0) % gradients.length;
  return gradients[idx];
}

export default function Avatar({
  src,
  name,
  size = "md",
  online,
  className,
}: AvatarProps) {
  const { container, text, indicator } = sizeMap[size];

  return (
    <div className={cn("relative inline-flex shrink-0", container, className)}>
      {src ? (
        <Image
          src={src}
          alt={name || "Avatar"}
          fill
          className="rounded-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "w-full h-full rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-white select-none",
            `bg-gradient-to-br ${getGradient(name)}`
          )}
        >
          <span className={text}>{getInitials(name)}</span>
        </div>
      )}

      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-bg-primary",
            indicator,
            online ? "bg-green-400" : "bg-text-muted"
          )}
        />
      )}
    </div>
  );
}
