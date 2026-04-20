import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Github,
  Layers3,
  Linkedin,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import BrandLogo from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGsapPageReveal } from "@/hooks/useGsapPageReveal";

const contactRoutes = [
  {
    icon: Mail,
    label: "Email",
    value: "123cs0013@iiitk.ac.in",
    href: "mailto:123cs0013@iiitk.ac.in",
    description: "Best for product ideas, frontend work, and detailed feedback.",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 99081 79816",
    href: "tel:+919908179816",
    description: "Best for direct coordination and quick discussion.",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "saathvik-codes",
    href: "https://github.com/saathvik-codes",
    description: "See current code, experiments, and implementation style.",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Saathvik Kalepu",
    href: "https://www.linkedin.com/in/saathvik-kalepu-17041228b/",
    description: "Best for professional connection and ongoing conversation.",
  },
] as const;

const collaborationPoints = [
  {
    icon: Layers3,
    title: "Design systems",
    copy: "Premium UI structure, brand direction, reusable components, and better visual hierarchy.",
  },
  {
    icon: Code2,
    title: "Frontend polish",
    copy: "React implementation, landing-page refinement, dashboard cleanup, and better interaction design.",
  },
  {
    icon: WandSparkles,
    title: "Motion direction",
    copy: "GSAP, scroll storytelling, elegant section reveals, and calmer interaction feedback.",
  },
] as const;

const workingStyle = [
  "Direct communication with strong visual taste.",
  "Fast iteration on layout, motion, and clarity.",
  "Preference for polished execution over filler features.",
  "Careful attention to how users feel while reading and interacting.",
] as const;

export default function Contact() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapPageReveal(rootRef);

  return (
    <div ref={rootRef} className="min-h-screen bg-transparent">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div data-orb className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
        <div data-orb className="absolute right-[-6rem] top-1/4 h-80 w-80 rounded-full bg-secondary/16 blur-3xl" />
        <div data-orb className="absolute bottom-[-4rem] left-1/4 h-72 w-72 rounded-full bg-accent/12 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/">
            <BrandLogo size="sm" subtitle={false} />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/"
              className="inline-flex items-center font-soft text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 pb-20 pt-12">
        <div className="container mx-auto">
          <section className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div data-hero className="max-w-3xl">
              <Badge className="rounded-full border-primary/20 bg-primary/10 px-4 py-2 text-primary">
                Personal contact page
              </Badge>
              <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.94] text-foreground sm:text-6xl">
                A cleaner contact experience,
                <span className="mt-2 block font-cursive text-gradient-primary">centered on one person.</span>
              </h1>
              <p className="mt-6 max-w-2xl font-body text-lg leading-8 text-muted-foreground">
                This page now focuses entirely on Saathvik Kalepu instead of reading like a directory. It is designed
                to feel more personal, more deliberate, and much more interesting to explore.
              </p>
              <p className="mt-4 max-w-2xl font-body text-lg leading-8 text-muted-foreground">
                If you want to talk about interface design, frontend polish, branding, motion, or the direction of
                Serenity itself, this is the page that should actually make you want to reach out.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" variant="hero">
                  <a href="mailto:123cs0013@iiitk.ac.in">
                    Start a conversation
                    <ArrowRight />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="btn-enhanced">
                  <a href="https://www.linkedin.com/in/saathvik-kalepu-17041228b/" target="_blank" rel="noreferrer">
                    View LinkedIn
                  </a>
                </Button>
              </div>
            </div>

            <div data-hero className="relative">
              <Card className="premium-panel overflow-hidden rounded-[2rem] border-0 p-0 shadow-[0_34px_90px_hsl(var(--secondary)/0.16)]">
                <div className="relative overflow-hidden p-7">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_38%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.18),transparent_38%)]" />
                  <div className="relative">
                    <div className="mb-6 flex items-center justify-between">
                      <Badge className="rounded-full border-secondary/20 bg-secondary/10 px-4 py-2 text-secondary">
                        Available to connect
                      </Badge>
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-[0.86fr_1.14fr]">
                      <div className="flex min-h-[320px] flex-col justify-between rounded-[1.7rem] border border-border/60 bg-[linear-gradient(145deg,hsl(var(--primary)),hsl(var(--secondary)))] p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
                        <div>
                          <div className="font-soft text-[11px] uppercase tracking-[0.36em] text-white/72">Contact focus</div>
                          <div className="mt-4 max-w-[190px] rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-white/80">
                            Saathvik Kalepu
                          </div>
                        </div>
                        <div>
                          <div className="font-display text-7xl font-semibold leading-none">SK</div>
                          <div className="mt-4 space-y-2 text-sm text-white/84">
                            <div>Product storytelling</div>
                            <div>Frontend execution</div>
                            <div>Elegant interaction design</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-6">
                        <div>
                          <div className="font-soft text-[11px] uppercase tracking-[0.32em] text-foreground/48">
                            Frontend and product craft
                          </div>
                          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground">Saathvik Kalepu</h2>
                          <p className="mt-4 font-body text-base leading-7 text-muted-foreground">
                            Working on the visual identity, interaction quality, and overall emotional tone of Serenity.
                          </p>
                        </div>

                        <div className="grid gap-3">
                          {[
                            "Interested in elegant product interfaces",
                            "Focused on cleaner storytelling and stronger first impressions",
                            "Prefers design choices that people actually remember",
                          ].map((line) => (
                            <div key={line} className="rounded-2xl border border-border/70 bg-background/72 px-4 py-3 text-sm text-foreground/80">
                              {line}
                            </div>
                          ))}
                        </div>

                        <div className="rounded-[1.5rem] border border-primary/12 bg-primary/8 p-5">
                          <div className="flex items-start gap-3">
                            <MessageSquare className="mt-1 h-5 w-5 text-primary" />
                            <p className="font-body text-sm leading-7 text-foreground/78">
                              Expect responses around product vision, frontend implementation, motion direction, and
                              how to make Serenity feel more premium and more readable.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <section className="mt-20" data-reveal>
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="rounded-full border-accent/20 bg-accent/10 px-4 py-2 text-foreground">
                Reach out directly
              </Badge>
              <h2 className="mt-5 font-display text-4xl font-semibold text-foreground md:text-5xl">
                Every route here is designed to make contacting Saathvik feel simple and intentional.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {contactRoutes.map((route, index) => {
                const Icon = route.icon;

                return (
                  <a
                    key={route.label}
                    href={route.href}
                    target={route.href.startsWith("http") ? "_blank" : undefined}
                    rel={route.href.startsWith("http") ? "noreferrer" : undefined}
                    className="group block"
                    data-float-card={index % 2 === 0 ? "" : undefined}
                  >
                    <Card className="premium-panel h-full rounded-[1.7rem] border-0 p-0 shadow-soft transition-transform duration-300 group-hover:-translate-y-1">
                      <CardHeader>
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/16 to-secondary/14 text-primary glow-effect">
                          <Icon className="h-7 w-7" />
                        </div>
                        <div className="font-soft text-[11px] uppercase tracking-[0.28em] text-foreground/48">{route.label}</div>
                        <CardTitle className="font-display text-2xl break-all">{route.value}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-body text-base leading-7 text-muted-foreground">{route.description}</p>
                      </CardContent>
                    </Card>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="mt-20 grid gap-8 lg:grid-cols-[1fr_0.96fr]" data-reveal>
            <div className="grid gap-5">
              {collaborationPoints.map((point) => {
                const Icon = point.icon;

                return (
                  <Card key={point.title} className="premium-panel rounded-[1.7rem] border-0 px-6 py-5 shadow-soft" data-float-card>
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/16 to-secondary/14 text-primary glow-effect">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-display text-2xl font-semibold text-foreground">{point.title}</div>
                        <p className="mt-2 font-body text-base leading-7 text-muted-foreground">{point.copy}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Card className="premium-panel rounded-[1.9rem] border-0 p-7 shadow-[0_26px_70px_hsl(var(--primary)/0.12)]">
              <Badge className="rounded-full border-secondary/20 bg-secondary/10 px-4 py-2 text-secondary">
                Working style
              </Badge>
              <h3 className="mt-5 font-display text-3xl font-semibold text-foreground">
                What makes this contact page more worth reading
              </h3>
              <p className="mt-4 font-body text-base leading-8 text-muted-foreground">
                Instead of listing everyone loosely, the page now reads like a direct invitation into one person&apos;s
                creative and technical focus. That makes the tone clearer and the next action much easier.
              </p>

              <div className="mt-8 grid gap-4">
                {workingStyle.map((item, index) => (
                  <div key={item} className="rounded-[1.4rem] border border-border/70 bg-background/72 px-5 py-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-base font-semibold text-primary">
                        {index + 1}
                      </div>
                      <p className="font-body text-base leading-7 text-foreground/78">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="mt-20" data-reveal>
            <Card className="overflow-hidden rounded-[2rem] border-0 bg-gradient-hero p-8 text-white shadow-[0_34px_90px_hsl(var(--primary)/0.24)] md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <Badge className="rounded-full border-white/20 bg-white/10 px-4 py-2 text-white">
                    Keep exploring
                  </Badge>
                  <h3 className="mt-5 font-display text-4xl font-semibold">
                    If the contact page feels better, the rest of the product should rise to that level too.
                  </h3>
                  <p className="mt-4 max-w-2xl font-body text-lg leading-8 text-white/90">
                    This redesign pushes the project toward a more focused voice: stronger branding, cleaner storytelling,
                    and pages that feel like they were made with intent rather than assembled by default.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button asChild size="lg" variant="secondary" className="border border-white/20 bg-white text-primary hover:bg-white/90">
                    <Link to="/about">
                      Read the about page
                      <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/40 bg-black/15 text-white hover:bg-white/10 hover:text-white">
                    <Link to="/auth">Open Serenity</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
