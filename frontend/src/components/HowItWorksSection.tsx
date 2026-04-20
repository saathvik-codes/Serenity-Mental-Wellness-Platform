import { ArrowRight, BarChart3, Brain, CheckCircle, Heart, Shield } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    step: "01",
    title: "Complete Assessment",
    description: "Move through familiar self-reflection assessments in a calmer interface that feels guided and readable.",
    icon: Brain,
    color: "text-primary",
  },
  {
    step: "02",
    title: "Get Insights",
    description: "Receive clearer summaries, gentle recommendations, and next steps that feel approachable instead of clinical.",
    icon: BarChart3,
    color: "text-secondary",
  },
  {
    step: "03",
    title: "Track Progress",
    description: "Review patterns, streaks, and mood movement in a dashboard that makes growth easier to notice over time.",
    icon: Heart,
    color: "text-wellness",
  },
  {
    step: "04",
    title: "Stay Grounded",
    description: "Important privacy cues, account settings, and personal records are surfaced clearly throughout the experience.",
    icon: Shield,
    color: "text-focus",
  },
] as const;

const features = [
  "Familiar assessment formats",
  "AI-guided reflections",
  "Readable progress tracking",
  "Visible privacy cues",
  "Weekly wellness snapshots",
  "Daily access from anywhere",
  "Multi-device continuity",
  "Summaries you can revisit later",
] as const;

export default function HowItWorksSection() {
  return (
    <section className="bg-gradient-to-br from-background to-wellness/5 px-6 py-20 dark:to-wellness/10">
      <div className="container mx-auto">
        <div className="mb-16 text-center" data-aos="fade-up">
          <Badge
            variant="outline"
            className="mb-4 border-wellness/30 bg-wellness/15 px-4 py-2 text-wellness neon-text dark:border-wellness/50 dark:bg-wellness/25 dark:text-wellness"
          >
            How It Works
          </Badge>
          <h2 className="font-serif text-4xl font-bold md:text-5xl">
            A calmer path to
            <span className="text-gradient-primary block">daily wellness</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">
            Move through a clear product rhythm that helps users check in, understand patterns, and return without
            friction.
          </p>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="h-full border-0 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-medium">
                <CardContent className="p-6 text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-white">
                      {step.step}
                    </div>
                  </div>

                  <div
                    className={`mx-auto mb-4 mt-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 ${step.color}`}
                  >
                    <step.icon className="h-8 w-8" />
                  </div>

                  <h3 className="mb-3 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>

              {index < steps.length - 1 && (
                <div className="absolute right-[-1rem] top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                  <ArrowRight className="h-6 w-6 text-primary/40" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div data-aos="fade-right">
            <h3 className="mb-6 font-serif text-3xl font-bold">
              Everything you need for
              <span className="text-gradient-primary block">a steadier routine</span>
            </h3>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              The product combines assessment flows, progress views, and softer daily rituals so users can keep
              returning without the interface feeling overwhelming.
            </p>

            <div className="mb-8 grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center space-x-3"
                  data-aos="fade-right"
                  data-aos-delay={index * 50}
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-wellness" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Button size="lg" variant="hero" className="btn-enhanced btn-glow" onClick={() => (window.location.href = "/auth")}>
              Start Your Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="relative" data-aos="fade-left">
            <Card className="border-0 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 shadow-strong">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <h4 className="mb-4 text-2xl font-bold">Designed for steady use</h4>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  The interface aims to stay understandable on hard days, with lighter language, calmer visuals, and
                  next steps that feel manageable.
                </p>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">4</div>
                    <div className="text-xs text-muted-foreground">Core steps</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">Daily</div>
                    <div className="text-xs text-muted-foreground">Check-ins</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-wellness">1</div>
                    <div className="text-xs text-muted-foreground">Wellness home</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
