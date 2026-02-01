"use client";

import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

type BadgeColor = "red" | "green" | "yellow" | "blue" | "muted" | "default";

interface StatusBadgeProps {
  color: BadgeColor;
  value: string;
  icon?: React.ReactNode;
  title?: string;
  className?: string;
}

export function StatusBadge({
  color,
  value,
  icon,
  title,
  className,
}: StatusBadgeProps) {
  const classes = clsx(
    "flex items-center gap-1 border rounded-sm px-2 py-1 text-xs font-medium",
    {
      "bg-red-500/10 text-red-500 border-red-500/30": color === "red",

      "bg-emerald-700/10 text-emerald-800 border-emerald-500/30":
        color === "green",

      "bg-yellow-600/10 text-yellow-800 border-yellow-500/30":
        color === "yellow",

      "bg-blue-500/10 text-blue-800 border-blue-500/30": color === "blue",

      "bg-muted-foreground/10 text-black border-muted-foreground/30":
        color === "muted",

      "bg-muted/10 text-muted-foreground border-muted-foreground/30":
        color === "default",
    },
    className,
  );

  return (
    <Badge variant="outline" className={classes} title={title}>
      {icon && <span>{icon}</span>}
      <span>{value}</span>
    </Badge>
  );
}
