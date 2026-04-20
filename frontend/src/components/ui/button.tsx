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
          "bg-primary text-primary-foreground shadow-[0_12px_30px_hsl(var(--primary)/0.2)] hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_20px_40px_hsl(var(--primary)/0.26)] active:translate-y-0 active:scale-[0.99] dark:hover:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_12px_30px_hsl(var(--destructive)/0.22)] hover:-translate-y-0.5 hover:bg-destructive/90 hover:shadow-[0_20px_40px_hsl(var(--destructive)/0.28)] active:translate-y-0 active:scale-[0.99]",
        outline:
          "border border-border/70 bg-background/80 text-foreground backdrop-blur-sm shadow-[0_10px_24px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow-[0_16px_35px_hsl(var(--primary)/0.12)] active:translate-y-0 active:scale-[0.99] dark:bg-card/70 dark:hover:bg-primary/10",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_12px_28px_hsl(var(--secondary)/0.18)] hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-[0_18px_36px_hsl(var(--secondary)/0.24)] active:translate-y-0 active:scale-[0.99] dark:hover:bg-secondary/70",
        ghost:
          "bg-transparent text-foreground/80 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary hover:shadow-[0_12px_24px_hsl(var(--primary)/0.08)] active:translate-y-0 active:scale-[0.99] dark:hover:bg-primary/10",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 dark:text-primary dark:hover:text-primary/80",
        hero:
          "relative overflow-hidden rounded-full border border-primary/20 bg-[linear-gradient(135deg,hsl(var(--primary))_0%,hsl(var(--accent))_100%)] px-6 text-primary-foreground shadow-[0_18px_48px_hsl(var(--primary)/0.32)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_55%)] before:opacity-80 before:transition-opacity hover:-translate-y-0.5 hover:shadow-[0_26px_62px_hsl(var(--primary)/0.38)] hover:before:opacity-100 active:translate-y-0 active:scale-[0.99]",
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
