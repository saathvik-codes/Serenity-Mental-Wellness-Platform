export default function LandingHeroScene() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.24),transparent_28%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.26),transparent_32%),linear-gradient(180deg,rgba(11,17,10,0.92),rgba(21,16,12,0.98))]" />

      <div className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle,hsl(var(--primary)/0.2),transparent_65%)] blur-sm" />
      <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle,hsl(var(--secondary)/0.16),transparent_68%)] animate-[spin_22s_linear_infinite]" />
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 animate-[spin_34s_linear_infinite_reverse]" />

      <div className="absolute left-[14%] top-[18%] h-28 w-28 rounded-[2rem] border border-white/10 bg-[linear-gradient(155deg,hsl(var(--primary)/0.75),hsl(var(--secondary)/0.42))] shadow-[0_18px_50px_hsl(var(--primary)/0.28)] animate-[float_9s_ease-in-out_infinite]" />
      <div className="absolute right-[14%] top-[22%] h-36 w-36 rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_35%),linear-gradient(180deg,hsl(var(--secondary)/0.68),hsl(var(--primary)/0.28))] animate-[float_11s_ease-in-out_infinite]" />
      <div className="absolute bottom-[18%] left-[19%] h-24 w-24 rounded-full border border-white/10 bg-[linear-gradient(180deg,hsl(var(--accent)/0.72),hsl(var(--secondary)/0.28))] animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[14%] right-[18%] h-32 w-32 rounded-[2.4rem] border border-white/10 bg-[linear-gradient(145deg,hsl(var(--primary)/0.72),hsl(var(--accent)/0.3))] shadow-[0_18px_42px_hsl(var(--secondary)/0.22)] animate-[float_10s_ease-in-out_infinite]" />

      <div className="absolute inset-x-[16%] bottom-[20%] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)]" />
      <div className="absolute inset-x-[24%] top-[24%] h-px bg-[linear-gradient(90deg,transparent,hsl(var(--primary)/0.65),transparent)]" />

      <div className="absolute left-[28%] top-[31%] h-2 w-2 rounded-full bg-white/65 shadow-[0_0_18px_rgba(255,255,255,0.55)] animate-pulse" />
      <div className="absolute right-[30%] top-[38%] h-2.5 w-2.5 rounded-full bg-primary/80 shadow-[0_0_18px_hsl(var(--primary)/0.6)] animate-pulse" />
      <div className="absolute bottom-[30%] right-[34%] h-2 w-2 rounded-full bg-secondary/80 shadow-[0_0_18px_hsl(var(--secondary)/0.6)] animate-pulse" />
    </div>
  );
}
