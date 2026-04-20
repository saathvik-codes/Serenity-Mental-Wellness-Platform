import { RefObject, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapPageReveal(rootRef: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero]", {
        opacity: 0,
        y: 32,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>("[data-float-card]").forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 === 0 ? -12 : 12,
          duration: 4.8 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-orb]").forEach((orb, index) => {
        gsap.to(orb, {
          x: index % 2 === 0 ? 24 : -18,
          y: index === 1 ? 28 : -24,
          duration: 8 + index * 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((section, index) => {
        gsap.fromTo(
          section,
          {
            opacity: 0,
            y: 42,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.88,
            delay: index * 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 84%",
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}
