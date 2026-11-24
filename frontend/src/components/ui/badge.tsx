import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Rendered as a quiet text label: no pill, no fill, no icon. Variants only change the text colour.
const badgeVariants = cva(
  "inline-flex items-center gap-1 text-xs font-medium tracking-wide [&>svg]:hidden",
  {
    variants: {
      variant: {
        default: "text-primary",
        secondary: "text-muted-foreground",
        destructive: "text-destructive",
        outline: "text-foreground/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Callers often pass pill styling (fills, borders, padding, radius); drop it so every label looks the same.
const PILL = /^(?:[a-z0-9-]+:)*(?:bg-|border|rounded|px-|py-|p-|shadow|ring|backdrop-|from-|via-|to-|hover:bg-)/

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, onClick, ...props }: BadgeProps) {
  const kept = (className || "").split(/\s+/).filter((c) => c && !PILL.test(c)).join(" ");
  // Clickable badges are choices (filters, triggers), so they keep a visible chip shape.
  if (onClick) {
    const selected = variant === "default" || variant === undefined;
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); (onClick as any)(e); } }}
        aria-pressed={selected}
        className={cn(
          "inline-flex cursor-pointer select-none items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors [&>svg]:hidden",
          selected ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground/75 hover:border-primary/40",
          kept
        )}
        {...(props as React.HTMLAttributes<HTMLSpanElement>)}
      />
    );
  }
  return <span className={cn(badgeVariants({ variant }), kept)} {...(props as React.HTMLAttributes<HTMLSpanElement>)} />;
}

export { Badge, badgeVariants }
