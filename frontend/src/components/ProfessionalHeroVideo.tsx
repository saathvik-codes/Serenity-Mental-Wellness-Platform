import { useState } from "react";
import { Pause, Play, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProfessionalHeroVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="premium-panel relative overflow-hidden rounded-[2rem] p-3 shadow-[0_30px_90px_hsl(var(--primary)/0.16)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_45%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.18),transparent_40%)]" />

      <div className="relative overflow-hidden rounded-[1.6rem] border border-white/60 dark:border-white/10">
        {!isPlaying ? (
          <div className="relative aspect-[16/10] w-full">
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Guided wellness conversation in a calm clinical setting"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,18,0.1),rgba(10,10,18,0.75))]" />

            <div className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-white backdrop-blur-md">
              Guided walkthrough
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                onClick={() => setIsPlaying(true)}
                className="h-20 w-20 rounded-full border border-white/50 bg-white/90 text-primary shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:bg-white"
                aria-label="Play Serenity product walkthrough"
              >
                <Play className="ml-1 h-8 w-8" />
              </Button>
            </div>

            <div className="absolute inset-x-5 bottom-5">
              <div className="flex flex-col gap-4 rounded-[1.4rem] border border-white/20 bg-black/30 p-5 text-white backdrop-blur-xl md:flex-row md:items-end md:justify-between">
                <div className="max-w-xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                    <Sparkles className="h-3.5 w-3.5" />
                    Designed to feel calm, private, and premium
                  </div>
                  <h3 className="font-display text-2xl font-semibold leading-tight">
                    A guided look at the assessment, insights, and daily support experience.
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left text-sm text-white/80 md:min-w-[220px]">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
                    <div className="font-display text-lg font-semibold text-white">3 mins</div>
                    <div>Product walkthrough</div>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
                    <div className="font-display text-lg font-semibold text-white">Private</div>
                    <div>Privacy-first flows</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative aspect-[16/10] w-full">
            <iframe
              src="https://www.youtube.com/embed/DxIDKZHW3-E?autoplay=1&rel=0&modestbranding=1"
              title="Mental health awareness and Serenity product walkthrough"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsPlaying(false)}
              className="absolute right-4 top-4 border border-white/20 bg-black/40 text-white hover:bg-black/70 hover:text-white"
            >
              <Pause className="h-4 w-4" />
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
