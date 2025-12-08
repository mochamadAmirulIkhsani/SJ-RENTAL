import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border transition-all duration-300 group", {
  variants: {
    variant: {
      default: "border-border shadow-md hover:shadow-xl",
      elevated: "border-border shadow-lg hover:shadow-xl hover:-translate-y-1",
      gradient: "border-transparent shadow-lg hover:shadow-accent-lg bg-gradient-to-br from-accent/[0.03] to-transparent",
      featured: "shadow-xl hover:shadow-accent-lg",
    },
    size: {
      default: "py-6",
      sm: "py-4",
      lg: "py-8 md:py-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Card({ className, variant, size, ...props }: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return <div data-slot="card" className={cn(cardVariants({ variant, size }), className)} {...props} />;
}

// FeaturedCard with gradient border effect
function FeaturedCard({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("rounded-xl bg-linear-to-br from-accent via-accent-secondary to-accent p-0.5", className)} {...props}>
      <div className="h-full w-full rounded-2xl bg-card">{children}</div>
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("leading-none font-semibold", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center px-6 [.border-t]:pt-6", className)} {...props} />;
}

export { Card, FeaturedCard, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
