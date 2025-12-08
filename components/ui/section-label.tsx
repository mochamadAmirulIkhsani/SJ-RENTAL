import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
}

export function SectionLabel({ children, animated = false, className, ...props }: SectionLabelProps) {
  return (
    <div className={cn("inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-5 py-2", className)} {...props}>
      <span className={cn("h-2 w-2 rounded-full bg-accent", animated && "animate-pulse-glow")} />
      <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">{children}</span>
    </div>
  );
}
