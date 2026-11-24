import { useEffect, useMemo, useState } from "react";

export type Slide = { src: string; caption: string };

type Props = {
  slides: Slide[];
  /** ms between slides; motion is turned off for people who ask for reduced motion */
  interval?: number;
};

/**
 * Quiet illustration carousel for the side panel of the sign-in / sign-up screen.
 * Slides whose image fails to load are dropped, so new illustrations can be listed
 * before the files exist.
 */
export default function AuthCarousel({ slides, interval = 6000 }: Props) {
  const [broken, setBroken] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const visible = useMemo(() => slides.filter((s) => !broken.includes(s.src)), [slides, broken]);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => setIndex(0), [slides]);
  useEffect(() => {
    if (paused || reduceMotion || visible.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % visible.length), interval);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, visible.length, interval]);

  if (visible.length === 0) return <div className="flex-1" />;
  const current = index % visible.length;

  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative min-h-0 flex-1">
        {visible.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt=""
            width={380}
            height={464}
            loading={i === 0 ? "eager" : "lazy"}
            onError={() => setBroken((b) => [...b, slide.src])}
            className={`illus absolute inset-0 m-auto h-full max-h-[440px] w-auto max-w-[380px] object-contain py-6 transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <p className="min-h-[3.5rem] max-w-sm text-lg leading-7 text-foreground/75" aria-live="polite">
        {visible[current].caption}
      </p>
      {visible.length > 1 && (
        <div className="mt-4 flex gap-2">
          {visible.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show illustration ${i + 1} of ${visible.length}`}
              aria-current={i === current}
              className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-primary" : "w-1.5 bg-foreground/25 hover:bg-foreground/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
