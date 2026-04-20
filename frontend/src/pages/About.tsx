import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Compass,
  HeartHandshake,
  Shield,
  Sparkles,
} from "lucide-react";

import BrandLogo from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGsapPageReveal } from "@/hooks/useGsapPageReveal";

const productPromises = [
  {
    icon: Compass,
    title: "Calm first impressions",
    copy: "Every screen is being tuned to feel lighter, clearer, and more emotionally safe from the very first glance.",
  },
  {
    icon: Brain,
    title: "Readable mental-health data",
    copy: "Assessments and progress views are designed to feel understandable rather than clinical or overwhelming.",
  },
  {
    icon: Shield,
    title: "Visible trust cues",
    copy: "Privacy, safety, and sensitivity are treated as part of the interface itself, not an afterthought.",
  },
] as const;

const buildPrinciples = [
  "Reduce emotional friction before asking users to share anything personal.",
  "Make the product feel premium without feeling cold or inaccessible.",
  "Turn wellness metrics into something people can actually revisit and understand.",
  "Use motion to guide attention, not to distract from moments that deserve care.",
] as const;

const focusMoments = [
  {
    label: "Product direction",
    value: "Personal, private, elegant",
  },
  {
    label: "Current craft",
    value: "Frontend systems, motion, UI polish",
  },
  {
    label: "North star",
    value: "A calmer relationship with self-reflection",
  },
] as const;

export default function About() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapPageReveal(rootRef);

  return (
    <div ref={rootRef} className="min-h-screen bg-transparent">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div data-orb className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
        <div data-orb className="absolute right-[-4rem] top-1/4 h-80 w-80 rounded-full bg-secondary/14 blur-3xl" />
        <div data-orb className="absolute bottom-[-5rem] left-1/3 h-72 w-72 rounded-full bg-accent/12 blur-3xl" />
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
          <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div data-hero className="max-w-3xl">
              <Badge className="rounded-full border-primary/20 bg-primary/10 px-4 py-2 text-primary">
                Built with personal ownership
              </Badge>
              <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.94] text-foreground sm:text-6xl">
                Serenity is being shaped by
                <span className="mt-2 block font-cursive text-gradient-primary">Saathvik Kalepu.</span>
              </h1>
              <p className="mt-6 max-w-2xl font-body text-lg leading-8 text-muted-foreground">
                This project is moving away from a generic team-page feeling and toward a clearer personal vision:
                a mental-wellness product that feels refined, private, and genuinely gentle to use.
              </p>
              <p className="mt-4 max-w-2xl font-body text-lg leading-8 text-muted-foreground">
                The work centers on interface design, frontend systems, motion language, and the emotional quality of
                the product, so people feel more invited to reflect instead of pressured to perform.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" variant="hero">
                  <Link to="/contact">
                    Connect with Saathvik
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="btn-enhanced">
                  <Link to="/auth">Enter the product</Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {focusMoments.map((item) => (
                  <div key={item.label} className="premium-panel rounded-[1.4rem] px-5 py-4 shadow-soft" data-float-card>
                    <div className="font-soft text-[11px] uppercase tracking-[0.28em] text-foreground/48">{item.label}</div>
                    <div className="mt-3 font-display text-xl font-semibold text-foreground">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div data-hero className="relative">
              <Card className="premium-panel overflow-hidden rounded-[2rem] border-0 p-0 shadow-[0_34px_90px_hsl(var(--secondary)/0.16)]">
                <div className="relative overflow-hidden p-7">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_38%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.18),transparent_38%)]" />
                  <div className="relative">
                    <div className="mb-6 flex items-center justify-between">
                      <Badge className="rounded-full border-secondary/20 bg-secondary/10 px-4 py-2 text-secondary">
                        Personal profile
                      </Badge>
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-[0.84fr_1.16fr]">
                      <div className="flex min-h-[320px] flex-col justify-between rounded-[1.7rem] border border-border/60 bg-[linear-gradient(145deg,hsl(var(--primary)),hsl(var(--secondary)))] p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
                        <div>
                          <div className="font-soft text-[11px] uppercase tracking-[0.36em] text-white/72">Creative profile</div>
                          <div className="mt-4 max-w-[180px] rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-white/80">
                            Serenity
                          </div>
                        </div>
                        <div>
                          <div className="font-display text-7xl font-semibold leading-none">SK</div>
                          <div className="mt-4 space-y-2 text-sm text-white/84">
                            <div>Frontend systems</div>
                            <div>Motion direction</div>
                            <div>Brand refinement</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-6">
                        <div>
                          <div className="font-soft text-[11px] uppercase tracking-[0.3em] text-foreground/48">
                            Design and frontend lead
                          </div>
                          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground">Saathvik Kalepu</h2>
                          <p className="mt-4 font-body text-base leading-7 text-muted-foreground">
                            Focused on turning Serenity into a product that feels emotionally intelligent, visually
                            distinct, and much more compelling to explore.
                          </p>
                        </div>

                        <div className="grid gap-3">
                          {[
                            "Interface systems that feel premium, not generic",
                            "Motion and transitions that guide attention gracefully",
                            "Branding that feels warm, memorable, and trustworthy",
                          ].map((line) => (
                            <div key={line} className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-foreground/80">
                              {line}
                            </div>
                          ))}
                        </div>

                        <div className="rounded-[1.5rem] border border-primary/12 bg-primary/8 p-5">
                          <div className="flex items-start gap-3">
                            <HeartHandshake className="mt-1 h-5 w-5 text-primary" />
                            <p className="font-body text-sm leading-7 text-foreground/78">
                              "The goal is not just to make Serenity look better. It is to make people feel safer,
                              clearer, and more willing to return."
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
                What is being refined
              </Badge>
              <h2 className="mt-5 font-display text-4xl font-semibold text-foreground md:text-5xl">
                Serenity is being rebuilt to feel more human, more composed, and more intentional.
              </h2>
              <p className="mt-5 font-body text-lg leading-8 text-muted-foreground">
                The product direction is less about shipping isolated features and more about shaping a coherent
                experience people actually want to spend time with.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {productPromises.map((promise) => {
                const Icon = promise.icon;
                return (
                  <Card
                    key={promise.title}
                    className="premium-panel group rounded-[1.7rem] border-0 p-0 shadow-soft transition-transform duration-300 hover:-translate-y-1"
                    data-float-card
                  >
                    <CardHeader className="pb-4">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/16 to-secondary/14 text-primary glow-effect">
                        <Icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="font-display text-2xl">{promise.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-body text-base leading-7 text-muted-foreground">{promise.copy}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="mt-20 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]" data-reveal>
            <Card className="premium-panel rounded-[1.9rem] border-0 p-7 shadow-[0_26px_70px_hsl(var(--primary)/0.12)]">
              <Badge className="rounded-full border-secondary/20 bg-secondary/10 px-4 py-2 text-secondary">
                Working principles
              </Badge>
              <h3 className="mt-5 font-display text-3xl font-semibold text-foreground">
                The aesthetic is meant to support trust, not just decoration.
              </h3>
              <p className="mt-4 font-body text-base leading-8 text-muted-foreground">
                That means keeping interactions readable, reducing noise, and choosing a tone that feels elevated
                without becoming cold. The interface should lower tension, not add to it.
              </p>

              <div className="mt-8 rounded-[1.6rem] border border-border/70 bg-background/72 p-5">
                <div className="font-soft text-[11px] uppercase tracking-[0.32em] text-foreground/48">Current emphasis</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Brand polish", "Hero storytelling", "Dashboard clarity", "Motion systems"].map((item) => (
                    <span key={item} className="rounded-full border border-border/70 bg-card px-3 py-2 text-sm text-foreground/76">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid gap-4">
              {buildPrinciples.map((principle, index) => (
                <Card
                  key={principle}
                  className="premium-panel rounded-[1.5rem] border-0 px-6 py-5 shadow-soft transition-transform duration-300 hover:-translate-y-1"
                  data-float-card={index % 2 === 0 ? "" : undefined}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-semibold text-primary">
                      {index + 1}
                    </div>
                    <p className="font-body text-base leading-8 text-foreground/78">{principle}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="mt-20" data-reveal>
            <Card className="overflow-hidden rounded-[2rem] border-0 bg-gradient-hero p-8 text-white shadow-[0_34px_90px_hsl(var(--primary)/0.24)] md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <Badge className="rounded-full border-white/20 bg-white/10 px-4 py-2 text-white">
                    Continue to contact
                  </Badge>
                  <h3 className="mt-5 font-display text-4xl font-semibold">
                    If the about page earns your attention, the contact page should earn your curiosity.
                  </h3>
                  <p className="mt-4 max-w-2xl font-body text-lg leading-8 text-white/90">
                    The next page is now focused on a single personal profile instead of a crowded team directory, so it
                    feels more direct, memorable, and worth reading.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button asChild size="lg" variant="secondary" className="border border-white/20 bg-white text-primary hover:bg-white/90">
                    <Link to="/contact">
                      Open contact page
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
