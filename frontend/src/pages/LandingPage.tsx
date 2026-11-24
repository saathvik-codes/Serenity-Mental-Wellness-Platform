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
  { label: "How it works", href: "#how" },
  { label: "Contact", href: "#contact" },
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
        className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-black shadow-sm"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-border bg-black/40 p-2 text-white transition-colors hover:bg-black/70"
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

// What the app actually offers, each linking to the real page
const offerings = [
  { title: "Check-ins", copy: "Short, validated questionnaires (PHQ-9 for low mood, GAD-7 for anxiety) with plain-language results.", href: "/assessment-center" },
  { title: "Mood log", copy: "A one-minute daily note on how you feel and what might have affected it.", href: "/mood-tracker" },
  { title: "Breathing and meditation", copy: "Guided sessions for a few minutes of calm, wherever you are.", href: "/mindfulness" },
  { title: "Progress", copy: "See how your scores and moods change over weeks, and export a report to share with a professional.", href: "/progress" },
  { title: "Community", copy: "Support groups and discussions with people who understand what you are going through.", href: "/community" },
  { title: "Help now", copy: "If things feel urgent, find crisis lines and nearby support in one place.", href: "/emergency-help" },
];

const steps = [
  { title: "Check in", copy: "Answer a short questionnaire or log your mood. It takes a couple of minutes.", image: "/illustrations/sn-journal.webp" },
  { title: "Take a breath", copy: "Use a guided breathing or meditation session when you need to slow down.", image: "/illustrations/sn-breathing.webp" },
  { title: "Stay connected", copy: "Follow your progress over time, and join a support group when talking helps.", image: "/illustrations/sn-stories-bench.webp" },
];

const LandingPage = () => {
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


  return (
    <div className="min-h-screen bg-transparent">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        
        
        
      </div>

      <nav className="fixed top-0 z-50 w-full border-b border-border cyber-glass">
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
              className="border-t border-border bg-background/95 px-6 pb-6 pt-3 md:hidden"
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
        <section className="px-6 pb-16 pt-32 lg:pt-40">
          <div className="container mx-auto grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h1 className="font-display text-5xl font-semibold leading-[1.02] text-foreground sm:text-6xl">
                A quiet place to check in with yourself.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/75">
                Serenity helps you notice how you are doing: short, validated check-ins, a daily mood log, guided breathing and
                meditation, and a clear view of how things change over time.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="/auth" className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Start a check-in
                </a>
                <a href="#how" className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:border-primary/60">
                  How it works
                </a>
              </div>
            </div>
            <img src="/illustrations/sn-hero-landscape.webp" alt="Rolling hills at dawn with a winding path" width={1200} height={600} className="hero-art h-auto w-full" />
          </div>
        </section>

        <section id="features" className="px-6 py-16">
          <div className="container mx-auto">
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">What you can do</h2>
            <div className="mt-10 grid border-t border-border sm:grid-cols-2 lg:grid-cols-3">
              {offerings.map((item) => (
                <a key={item.title} href={item.href} className="group border-b border-border py-7 pr-8 sm:[&:nth-child(odd)]:pr-10">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">{item.copy}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="px-6 py-16">
          <div className="container mx-auto">
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">How it works</h2>
            <ol className="mt-10 grid gap-10 md:grid-cols-3">
              {steps.map((step, i) => (
                <li key={step.title}>
                  <img src={step.image} alt="" width={320} height={176} loading="lazy" className="mb-6 h-40 w-full object-contain" />
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Step {i + 1}</p>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-6 py-10">
          <div className="container mx-auto rounded-xl border border-border bg-card px-6 py-6 md:flex md:items-center md:justify-between">
            <p className="text-sm leading-6 text-foreground/80">
              Serenity supports your wellbeing; it does not replace professional care. If you are in crisis, please reach out now.
            </p>
            <a href="/emergency-help" className="mt-3 inline-block text-sm font-semibold text-accent underline underline-offset-4 md:mt-0">
              Find immediate help
            </a>
          </div>
        </section>

        <section className="px-6 pb-24 pt-12">
          <div className="container mx-auto text-center">
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">Start with one check-in.</h2>
            <p className="mx-auto mt-4 max-w-lg text-foreground/70">It takes a few minutes, and you can come back whenever you like.</p>
            <a href="/auth" className="mt-8 inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Create your account
            </a>
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
