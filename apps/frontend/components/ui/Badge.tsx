import { cn } from "@/utils/cn";
import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "violet" | "cyan" | "success" | "warning" | "danger" | "muted";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-bg-elevated text-text-secondary border border-border",
  violet: "bg-violet/20 text-violet-light border border-violet/30",
  cyan: "bg-cyan/20 text-cyan-light border border-cyan/30",
  success: "bg-green-500/20 text-green-400 border border-green-500/30",
  warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  danger: "bg-red-500/20 text-red-400 border border-red-500/30",
  muted: "bg-transparent text-text-muted border border-border",
};

export default function Badge({
  variant = "default",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === "success" && "bg-green-400",
            variant === "danger" && "bg-red-400",
            variant === "warning" && "bg-yellow-400",
            variant === "violet" && "bg-violet",
            variant === "cyan" && "bg-cyan",
            (variant === "default" || variant === "muted") && "bg-text-muted"
          )}
        />
      )}
      {children}
    </span>
  );
}
