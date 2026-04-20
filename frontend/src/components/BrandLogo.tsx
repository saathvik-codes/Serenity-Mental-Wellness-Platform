import { cn } from "@/lib/utils";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  subtitle?: string | false;
  stacked?: boolean;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
};

const sizeStyles = {
  sm: {
    frame: "h-10 w-10 rounded-2xl p-1.5",
    title: "text-xl",
    subtitle: "text-[9px] tracking-[0.28em]",
  },
  md: {
    frame: "h-12 w-12 rounded-[1.1rem] p-1.5",
    title: "text-2xl",
    subtitle: "text-[10px] tracking-[0.32em]",
  },
  lg: {
    frame: "h-16 w-16 rounded-[1.4rem] p-2",
    title: "text-3xl",
    subtitle: "text-[11px] tracking-[0.34em]",
  },
} as const;

export default function BrandLogo({
  size = "md",
  showText = true,
  subtitle = "Mindful care",
  stacked = false,
  className,
  textClassName,
  iconClassName,
}: BrandLogoProps) {
  const styles = sizeStyles[size];

  return (
    <div className={cn("flex items-center gap-3", stacked && "flex-col text-center", className)}>
      <div
        className={cn(
          "shadow-neon flex items-center justify-center border border-white/60 bg-[linear-gradient(145deg,hsl(var(--background)),hsl(var(--primary)/0.08)_58%,hsl(var(--secondary)/0.12))] dark:border-white/10",
          styles.frame
        )}
      >
        <img
          src="/brand.svg"
          alt={showText ? "" : "Serenity logo"}
          className={cn("h-full w-full object-contain", iconClassName)}
        />
      </div>

      {showText && (
        <div className={cn(stacked && "items-center", textClassName)}>
          <div className={cn("font-cursive font-bold leading-none text-gradient-primary", styles.title)}>Serenity</div>
          {subtitle && (
            <div className={cn("font-soft uppercase text-foreground/50", styles.subtitle)}>
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
