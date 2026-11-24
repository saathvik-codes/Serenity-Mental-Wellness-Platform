export default function LandingHeroScene() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 " />

      <div className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10  blur-sm" />
      <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10  animate-[spin_22s_linear_infinite]" />
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 animate-[spin_34s_linear_infinite_reverse]" />

      <div className="absolute left-[14%] top-[18%] h-28 w-28 rounded-xl border border-white/10  shadow-sm animate-[float_9s_ease-in-out_infinite]" />
      <div className="absolute right-[14%] top-[22%] h-36 w-36 rounded-full border border-white/10  animate-[float_11s_ease-in-out_infinite]" />
      <div className="absolute bottom-[18%] left-[19%] h-24 w-24 rounded-full border border-white/10  animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[14%] right-[18%] h-32 w-32 rounded-xl border border-white/10  shadow-sm animate-[float_10s_ease-in-out_infinite]" />

      <div className="absolute inset-x-[16%] bottom-[20%] h-px " />
      <div className="absolute inset-x-[24%] top-[24%] h-px " />

      <div className="absolute left-[28%] top-[31%] h-2 w-2 rounded-full bg-white/65 shadow-sm animate-pulse" />
      <div className="absolute right-[30%] top-[38%] h-2.5 w-2.5 rounded-full bg-primary/80 shadow-sm animate-pulse" />
      <div className="absolute bottom-[30%] right-[34%] h-2 w-2 rounded-full bg-secondary/80 shadow-sm animate-pulse" />
    </div>
  );
}
