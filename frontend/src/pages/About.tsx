import { Link } from "react-router-dom";
import PublicHeader from "@/components/PublicHeader";

const PARTS = [
  { title: "Check-ins", copy: "Validated questionnaires such as PHQ-9 and GAD-7, saved so you can see how scores change." },
  { title: "Mood log", copy: "A daily mood entry with optional triggers, activities and a note, plus a 14-day trend." },
  { title: "Breathing and meditation", copy: "Short guided exercises, from box breathing to a body scan." },
  { title: "Talk it through", copy: "An AI companion that uses techniques from cognitive behavioural therapy. It is not a therapist." },
  { title: "Community", copy: "Discussions and support groups where your name stays hidden unless you share it." },
  { title: "Immediate help", copy: "Helplines and a map of nearby hospitals and clinics." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="container mx-auto px-6 py-16">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">About Serenity</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/75">
              Serenity is a place to notice how you are doing. It brings a few simple habits together: checking in,
              writing down your mood, taking a breath, and finding help when you need it.
            </p>
            <p className="mt-4 max-w-xl leading-7 text-foreground/70">
              It was built by Saathvik Kalepu as a student project. It supports wellbeing and does not replace
              professional care.
            </p>
          </div>
          <img src="/illustrations/sn-stories-bench.webp" alt="Two people sitting on a bench under a tree" width={500} height={350} className="illus h-auto w-full max-w-md justify-self-center" />
        </section>

        <section className="mt-20">
          <h2 className="font-display text-3xl font-semibold text-foreground">What is inside</h2>
          <div className="mt-8 grid border-t border-border sm:grid-cols-2 lg:grid-cols-3">
            {PARTS.map((p) => (
              <div key={p.title} className="border-b border-border py-6 pr-8">
                <h3 className="font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/70">{p.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">Your data</h2>
            <p className="mt-3 leading-7 text-foreground/75">
              Check-ins, mood entries and chats are stored in your own account and are only read to show them back to you.
              You can delete your account and its data from Settings.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">Questions or feedback</h2>
            <p className="mt-3 leading-7 text-foreground/75">
              Use the <Link to="/contact" className="font-semibold text-primary underline underline-offset-4">contact form</Link>.
              If you are in crisis, go to <Link to="/emergency-help" className="font-semibold text-accent underline underline-offset-4">immediate help</Link>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
