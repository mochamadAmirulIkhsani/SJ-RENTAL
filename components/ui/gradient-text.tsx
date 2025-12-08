import * as React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  underline?: boolean;
}

export function GradientText({ children, underline = false, className, ...props }: GradientTextProps) {
  return (
    <span className={cn("relative inline-block", className)} {...props}>
      <span className="gradient-text">{children}</span>
      {underline && <span className="absolute bottom-0 left-0 h-3 w-full rounded-sm bg-linear-to-r from-accent/15 to-accent-secondary/10 md:-bottom-2 md:h-4" />}
    </span>
  );
}
