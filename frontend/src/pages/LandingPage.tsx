import { Suspense, lazy, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Activity,
  ArrowRight,
  Bell,
  Brain,
  CheckCircle2,
  Heart,
  Menu,
  Shield,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import BrandLogo from "@/components/BrandLogo";
import HowItWorksSection from "@/components/HowItWorksSection";
import InfiniteCarousel from "@/components/InfiniteCarousel";
import ProfessionalHeroVideo from "@/components/ProfessionalHeroVideo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const navigationItems = [
  { label: "Features", href: "#features" },
  { label: "Experience", href: "#experience" },
] as const;

const heroStats = [
  { value: "12+", label: "Guided wellness flows" },
  { value: "24/7", label: "Calm, always-on support" },
  { value: "Private", label: "User-first privacy posture" },
] as const;

const trustPillars = [
  "Validated assessments with gentle explanations",
  "AI reflections designed for real-life routines",
  "Progress tracking that feels clear, not clinical",
] as const;

const features = [
  {
    icon: Brain,
    title: "Validated assessments",
    description: "PHQ-9, GAD-7, PCL-5, and guided check-ins presented with a calmer, easier experience.",
    color: "text-primary",
    detail: "Move from uncertainty to clarity with screening tools that feel approachable and structured.",
    bullets: ["Clinically grounded question flows", "Readable score summaries", "Fast repeat check-ins"],
  },
  {
    icon: TrendingUp,
    title: "Elegant progress tracking",
    description: "See mood movement, streaks, and behavioral trends in a dashboard that feels premium and readable.",
    color: "text-wellness",
    detail: "Progress is framed as momentum, not pressure, so users can notice patterns without feeling overwhelmed.",
    bullets: ["Trend cards and weekly snapshots", "Visual progress summaries", "Healthy habit reminders"],
  },
  {
    icon: Heart,
    title: "Personalized guidance",
    description: "Receive supportive recommendations, daily rituals, and therapeutic prompts tailored to your needs.",
    color: "text-energy",
    detail: "Insights adapt to what the user is experiencing and suggest the next best step instead of generic advice.",
    bullets: ["Context-aware suggestions", "Daily wellness prompts", "Actionable coping techniques"],
  },
  {
    icon: Users,
    title: "Human-centered community",
    description: "Support groups, shared stories, and guided discussion spaces that reduce isolation without adding noise.",
    color: "text-secondary",
    detail: "The social layer is designed to feel safe, moderated, and emotionally useful rather than crowded.",
    bullets: ["Supportive discussion spaces", "Moderated wellness conversations", "Shared accountability"],
  },
  {
    icon: Bell,
    title: "Adaptive reminders",
    description: "Gentle nudges help users stay consistent without making the product feel demanding or intrusive.",
    color: "text-accent",
    detail: "Reminders are framed like coaching cues and can reinforce reflection, tracking, and healthier routines.",
    bullets: ["Smart timing for check-ins", "Habit-friendly language", "Reduced notification fatigue"],
  },
  {
    icon: Shield,
    title: "Privacy-first by design",
    description: "Sensitive wellness data is handled with a clear privacy posture that reinforces trust from first use.",
    color: "text-focus",
    detail: "Confidence matters in mental health products, so privacy is made visible instead of hidden in the footer.",
    bullets: ["Secure account flows", "Protected records", "Transparent trust messaging"],
  },
] as const;

// Drawings for three of the features above; the words under each come from the feature itself, so they cannot drift apart
const calmTiles = [
  { title: "Personalized guidance", image: "/illustrations/sn-journal.webp" },
  { title: "Adaptive reminders", image: "/illustrations/sn-breathing.webp" },
  { title: "Human-centered community", image: "/illustrations/sn-stories-bench.webp" },
];

const benefitList = [
  "Early pattern detection with less friction.",
  "Personalized recommendations that feel actionable.",
  "Support between therapy or counseling sessions.",
  "A calmer onboarding experience for first-time users.",
  "Better habit consistency through thoughtful reminders.",
  "Lower stigma through elegant, private design.",
] as const;

const routineMoments = [
  {
    icon: Heart,
    title: "Start with a soft check-in",
    copy: "A quick mood note or guided prompt can turn self-reflection into something approachable instead of heavy.",
    note: "Designed for a low-friction daily habit",
  },
  {
    icon: Bell,
    title: "Keep momentum without pressure",
    copy: "Gentle reminders and light-touch rituals help users stay consistent without feeling monitored.",
    note: "Useful when routines feel hard to maintain",
  },
  {
    icon: TrendingUp,
    title: "Review progress with clarity",
    copy: "Weekly summaries and visual patterns help people notice movement over time without drowning them in metrics.",
    note: "A calmer way to revisit personal progress",
  },
] as const;

const productPrinciples = [
  {
    icon: Shield,
    title: "Visible privacy cues",
    copy: "Important account and privacy signals are surfaced in the experience instead of buried in small print.",
  },
  {
    icon: Brain,
    title: "Readable guidance",
    copy: "Language, layout, and feedback are tuned to feel understandable even when someone is emotionally tired.",
  },
  {
    icon: Users,
    title: "Supportive tone",
    copy: "The product aims to feel steady, human, and respectful rather than overly clinical or overly bright.",
  },
  {
    icon: Activity,
    title: "Useful reflection loops",
    copy: "Check-ins, summaries, and next steps are shaped to encourage return visits without creating guilt.",
  },
] as const;


function VideoModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 30 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-black shadow-sm"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/40 p-2 text-white transition-colors hover:bg-black/70"
          aria-label="Close video"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="aspect-video">
          <iframe
            src="https://www.youtube.com/embed/NQcYZplTXnQ?autoplay=1&rel=0&modestbranding=1"
            title="Serenity app demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      mirror: false,
      offset: 40,
    });
  }, []);

  const featuredCapability = features[activeFeature];
  const FeaturedIcon = featuredCapability.icon;

  return (
    <div className="min-h-screen bg-transparent">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <nav className="fixed top-0 z-50 w-full border-b border-white/20 cyber-glass">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <BrandLogo size="md" />
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-soft text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
                >
                  {item.label}
                </a>
              ))}
              <Link to="/about" className="font-soft text-sm font-semibold text-foreground/70 transition-colors hover:text-primary">
                About
              </Link>
              <Link to="/contact" className="font-soft text-sm font-semibold text-foreground/70 transition-colors hover:text-primary">
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild variant="hero" className="hidden md:inline-flex">
                <Link to="/auth">Get Started</Link>
              </Button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background/70 text-foreground md:hidden"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 bg-background/95 px-6 pb-6 pt-3 backdrop-blur-xl md:hidden"
            >
              <div className="space-y-3">
                {navigationItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block rounded-2xl px-4 py-3 font-soft text-sm font-semibold text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  to="/about"
                  className="block rounded-2xl px-4 py-3 font-soft text-sm font-semibold text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block rounded-2xl px-4 py-3 font-soft text-sm font-semibold text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
              <div className="mt-5 grid gap-3 border-t border-border/70 pt-5">
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="hero" className="w-full justify-center">
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>{isVideoModalOpen && <VideoModal onClose={() => setIsVideoModalOpen(false)} />}</AnimatePresence>

      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-32 lg:pt-36">
          <div className="container mx-auto">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="max-w-3xl" data-aos="fade-right">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Premium mental wellness, made approachable</p>

                <div className="mb-5 font-soft text-sm uppercase tracking-[0.3em] text-foreground/60">
                  <TypeAnimation
                    sequence={["Private check-ins", 1600, "Beautiful progress tracking", 1600, "Support that feels human", 1600]}
                    speed={55}
                    repeat={Infinity}
                  />
                </div>

                <h1 className="font-display text-5xl font-semibold leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
                  Serenity makes mental wellness feel
                  <span className="mt-2 block font-cursive text-gradient-primary">calm, personal, and beautifully guided.</span>
                </h1>

                <p className="mt-7 max-w-2xl font-body text-lg leading-8 text-muted-foreground sm:text-xl">
                  A refined digital companion for assessments, daily reflection, AI-guided insights, and progress tracking.
                  Built to feel elegant for users and credible for care-aware experiences.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button asChild size="lg" variant="hero" className="group">
                    <Link to="/auth">
                      Start your assessment
                      <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="btn-enhanced" onClick={() => setIsVideoModalOpen(true)}>
                    Watch the product film
                  </Button>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {heroStats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className="premium-panel rounded-xl px-5 py-4 shadow-soft"
                      data-aos="fade-up"
                      data-aos-delay={index * 120}
                    >
                      <div className="font-display text-2xl font-semibold text-foreground">{stat.value}</div>
                      <div className="mt-1 font-body text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {trustPillars.map((item, index) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border/70 bg-white/60 px-4 py-3 text-sm text-foreground/80 shadow-sm backdrop-blur-sm dark:bg-card/60"
                      data-aos="fade-up"
                      data-aos-delay={index * 110}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative" data-aos="fade-left">
                <img src="/illustrations/sn-hero-landscape.webp" alt="Rolling hills at dawn with a winding path" width={1200} height={600} className="hero-art h-auto w-full" />
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="px-6 pb-10">
          <div className="container mx-auto">
            <div className="rounded-xl bg-gradient-hero p-[1px] shadow-sm">
              <div className="grid gap-6 rounded-xl bg-background/90 p-6 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
                <div data-aos="fade-right">
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Designed like a premium wellness product</p>
                  <h2 className="font-display text-3xl font-semibold leading-tight text-foreground md:text-4xl">
                    A softer, higher-trust first impression for people who may already be overwhelmed.
                  </h2>
                  <p className="mt-4 max-w-2xl font-body text-lg leading-8 text-muted-foreground">
                    The new landing experience balances clinical credibility with emotional warmth: polished typography,
                    confident motion, richer buttons, and clear product storytelling instead of a generic feature dump.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2" data-aos="fade-left">
                  {[
                    { title: "Focused hierarchy", copy: "Clearer hero structure makes the first action obvious." },
                    { title: "Richer motion", copy: "Layered ambient visuals and softer hover states add depth without noise." },
                    { title: "Premium typography", copy: "Outfit, Figtree, and Quicksand create a more editorial look." },
                    { title: "Friendlier CTAs", copy: "Buttons now feel tactile, elevated, and easier to trust." },
                  ].map((item) => (
                    <div key={item.title} className="premium-panel rounded-xl p-5">
                      <div className="font-display text-xl font-semibold text-foreground">{item.title}</div>
                      <div className="mt-2 font-body text-sm leading-6 text-muted-foreground">{item.copy}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="video" className="px-6 py-16">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Product film</p>
              <h2 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
                See the experience in motion before users ever sign in.
              </h2>
              <p className="mt-4 font-body text-lg leading-8 text-muted-foreground">
                The walkthrough now sits inside a more refined media shell, with better framing, stronger overlays, and
                motion that matches the rest of the landing page.
              </p>
            </div>

            <div className="mt-12" data-aos="fade-up" data-aos-delay="100">
              <ProfessionalHeroVideo />
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-20">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Core capabilities</p>
              <h2 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
                Everything a premium mental wellness product needs, without the clutter.
              </h2>
              <p className="mt-4 font-body text-lg leading-8 text-muted-foreground">
                Hover or focus a capability to preview the story it tells. The new layout gives each feature more weight
                and makes the product feel intentional instead of crowded.
              </p>
            </div>

            <div className="mt-14 grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
              <Card className="premium-panel sticky top-28 h-fit overflow-hidden rounded-xl border-0 p-0 shadow-sm">
                <div className=" p-8 dark:">
                  <div className="mb-5 flex items-center gap-4">
                    <div className={`glow-effect flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 ${featuredCapability.color}`}>
                      <FeaturedIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="font-soft text-[11px] uppercase tracking-[0.3em] text-foreground/50">Selected capability</div>
                      <h3 className="font-display text-3xl font-semibold text-foreground">{featuredCapability.title}</h3>
                    </div>
                  </div>

                  <p className="font-body text-lg leading-8 text-muted-foreground">{featuredCapability.detail}</p>

                  <div className="mt-8 grid gap-3">
                    {featuredCapability.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-white/60 px-4 py-3 dark:bg-card/60">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                        <span className="font-body text-sm leading-6 text-foreground/80">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isActive = index === activeFeature;

                  return (
                    <Card
                      key={feature.title}
                      className={`premium-panel group cursor-pointer rounded-xl border-0 transition-all duration-300 ${
                        isActive ? "translate-y-[-4px] shadow-sm" : "shadow-soft"
                      }`}
                      onMouseEnter={() => setActiveFeature(index)}
                      onFocus={() => setActiveFeature(index)}
                      tabIndex={0}
                      data-aos="fade-up"
                      data-aos-delay={index * 80}
                    >
                      <CardHeader>
                        <div className={`glow-effect mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:scale-105 ${feature.color}`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <CardTitle className="font-display text-2xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="font-body text-base leading-7 text-muted-foreground">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="container mx-auto">
            <div className="grid gap-6 md:grid-cols-3">
              {calmTiles.map((tile) => (
                <article key={tile.title} className="rounded-xl border border-border/60 bg-card/60 p-6" data-aos="fade-up">
                  <img src={tile.image} alt="" width={320} height={176} loading="lazy" className="mx-auto mb-5 h-44 w-full object-contain" />
                  <h3 className="font-display text-xl font-semibold text-foreground">{tile.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">{features.find((f) => f.title === tile.title)?.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="container mx-auto">
            <div className="grid gap-8 xl:grid-cols-[1fr_1.05fr]">
              <div data-aos="fade-right">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Impact and benefits</p>
                <h2 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
                  Better aesthetics are not cosmetic here. They directly improve trust, clarity, and willingness to engage.
                </h2>
                <p className="mt-5 font-body text-lg leading-8 text-muted-foreground">
                  In mental wellness products, first impressions carry emotional weight. The refreshed page reduces visual
                  friction, communicates privacy earlier, and makes the first step feel more considered.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {benefitList.map((benefit, index) => (
                    <div
                      key={benefit}
                      className="flex items-start gap-3 rounded-xl border border-border/70 bg-white/60 px-4 py-4 shadow-sm backdrop-blur-sm dark:bg-card/60"
                      data-aos="fade-up"
                      data-aos-delay={index * 70}
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-wellness" />
                      <span className="font-body text-sm leading-6 text-foreground/80">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button asChild size="lg" variant="hero" className="mt-8">
                  <Link to="/auth">
                    Join Serenity today
                    <ArrowRight />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-5" data-aos="fade-left">
                <Card className="holographic-card rounded-xl border-0 bg-gradient-calm p-8 text-white shadow-sm">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <div className="font-soft text-[11px] uppercase tracking-[0.3em] text-white/70">Global context</div>
                      <div className="mt-3 font-display text-5xl font-semibold">1 in 8</div>
                    </div>
                    <div className="glow-effect flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20">
                      <Heart className="h-8 w-8" />
                    </div>
                  </div>
                  <p className="mt-5 max-w-xl font-body text-lg leading-8 text-white/90">
                    People globally live with mental health disorders. A polished, accessible product can lower the
                    barrier to self-awareness and support-seeking.
                  </p>
                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                      <div className="font-display text-2xl font-semibold">Gentle onboarding</div>
                      <div className="mt-2 text-sm text-white/80">Lower pressure for first-time users.</div>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                      <div className="font-display text-2xl font-semibold">Visible trust cues</div>
                      <div className="mt-2 text-sm text-white/80">Privacy and safety stay front and center.</div>
                    </div>
                  </div>
                </Card>

                <div className="grid gap-5 md:grid-cols-2">
                  <Card className="premium-panel rounded-xl border-0 p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Users className="h-6 w-6" />
                      </div>
                      <div className="font-display text-2xl font-semibold">Human warmth</div>
                    </div>
                    <p className="mt-4 font-body text-sm leading-7 text-muted-foreground">
                      Softer copy, better hierarchy, and refined motion make the product feel more supportive.
                    </p>
                  </Card>
                  <Card className="premium-panel rounded-xl border-0 p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                        <Activity className="h-6 w-6" />
                      </div>
                      <div className="font-display text-2xl font-semibold">Clear action</div>
                    </div>
                    <p className="mt-4 font-body text-sm leading-7 text-muted-foreground">
                      Stronger CTA styling helps users understand where to begin without hesitation.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="px-6 py-20">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">What makes Serenity different</p>
              <h2 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
                A more expressive landing page backed by real product depth.
              </h2>
              <p className="mt-4 font-body text-lg leading-8 text-muted-foreground">
                The carousel now sits inside a cleaner editorial rhythm so each capability has space to breathe.
              </p>
            </div>

            <div className="mt-12" data-aos="fade-up" data-aos-delay="120">
              <InfiniteCarousel />
            </div>

            <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="180">
              <Button asChild variant="outline" size="lg" className="btn-enhanced">
                <Link to="/about">
                  Learn more about Serenity
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <HowItWorksSection />

        <section className="px-6 py-20">
          <div className="container mx-auto">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div data-aos="fade-up">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Built for real routines</p>
                <h2 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
                  Serenity is designed to fit into everyday life, not compete with it.
                </h2>
                <p className="mt-4 max-w-2xl font-body text-lg leading-8 text-muted-foreground">
                  The experience is shaped around small repeatable moments: a quick check-in, a clearer view of
                  progress, and gentle prompts that make returning feel natural instead of heavy.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
                {routineMoments.map((moment, index) => {
                  const Icon = moment.icon;

                  return (
                    <Card
                      key={moment.title}
                      className="premium-panel rounded-xl border border-primary/10 p-6"
                      data-aos="fade-up"
                      data-aos-delay={100 + index * 80}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">{moment.title}</h3>
                      <p className="mt-3 font-body text-sm leading-7 text-muted-foreground">{moment.copy}</p>
                      <div className="mt-5 font-soft text-xs font-semibold uppercase tracking-[0.24em] text-foreground/45">
                        {moment.note}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Product principles</p>
              <h2 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
                Clear, calm product decisions carry more trust than badges alone.
              </h2>
              <p className="mt-4 font-body text-lg leading-8 text-muted-foreground">
                Serenity now highlights the design choices that matter in day-to-day use: readable guidance, visible
                privacy cues, and a tone that feels supportive without sounding clinical.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {productPrinciples.map((principle, index) => {
                const Icon = principle.icon;

                return (
                  <Card
                    key={principle.title}
                    className="premium-panel rounded-xl border border-border/70 p-6"
                    data-aos="fade-up"
                    data-aos-delay={120 + index * 70}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{principle.title}</h3>
                    <p className="mt-3 font-body text-sm leading-7 text-muted-foreground">{principle.copy}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>


        <section className="relative overflow-hidden px-6 py-20">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-hologram opacity-80" />
          <div className="container relative z-10 mx-auto">
            <div className="mx-auto max-w-4xl text-center text-white" data-aos="zoom-in">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Ready when your users are</p>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">
                Launch a calmer, more elevated first impression for Serenity.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl font-body text-lg leading-8 text-white/90">
                The new page feels more premium, more readable, and more trustworthy without losing warmth. It is a much
                stronger entry point for sign-up and product exploration.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" variant="secondary" className="border border-white/20 bg-white text-primary hover:bg-white/90">
                  <Link to="/auth">
                    Start free assessment
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/50 bg-black/20 text-white hover:bg-white/10 hover:text-white">
                  <Link to="/about">Explore the platform</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="px-6 py-16">
        <div className="container mx-auto">
          <div className="premium-panel rounded-xl p-8 md:p-10">
            <div className="grid gap-10 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3">
                  <BrandLogo size="md" />
                </div>
                <p className="mt-5 max-w-lg font-body text-base leading-7 text-muted-foreground">
                  Serenity helps people understand, track, and improve mental wellness through elegant product design,
                  thoughtful tools, and private digital support.
                </p>
                <div className="mt-4 font-soft text-sm font-semibold uppercase tracking-[0.24em] text-foreground/40">
                  Mental wellness is not a luxury. It is a right.
                </div>
              </div>

              <div>
                <h4 className="font-display text-lg font-semibold text-foreground">Platform</h4>
                <div className="mt-4 space-y-3 font-body text-sm text-muted-foreground">
                  <div>Assessments</div>
                  <div>Tracking</div>
                  <div>Insights</div>
                  <div>Community</div>
                </div>
              </div>

              <div>
                <h4 className="font-display text-lg font-semibold text-foreground">Support</h4>
                <div className="mt-4 space-y-3 font-body text-sm text-muted-foreground">
                  <div>Help Center</div>
                  <div>Privacy Policy</div>
                  <div>Terms of Service</div>
                  <div>Contact Us</div>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-border/70 pt-6 text-center font-body text-sm text-muted-foreground">
              &copy; 2025 Serenity Mental Health Platform. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
