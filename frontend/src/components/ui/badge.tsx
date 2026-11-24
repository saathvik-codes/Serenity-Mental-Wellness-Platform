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

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), (className || "").split(/\s+/).filter((c) => c && !PILL.test(c)).join(" "))} {...(props as React.HTMLAttributes<HTMLSpanElement>)} />
  )
}

export { Badge, badgeVariants }
