import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold tracking-[0.01em] ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border/70 bg-background/80 text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:bg-card/70 dark:hover:bg-primary/10",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 dark:hover:bg-secondary/70",
        ghost:
          "bg-transparent text-foreground/80 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/10",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 dark:text-primary dark:hover:text-primary/80",
        hero:
          "relative overflow-hidden rounded-full border border-primary/20 bg-primary hover:bg-primary/90 px-6 text-primary-foreground before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_55%)] before:opacity-80 before:transition-opacity hover:before:opacity-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 px-7 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    // Ensure caller `className` is appended after variant classes so overrides apply
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
