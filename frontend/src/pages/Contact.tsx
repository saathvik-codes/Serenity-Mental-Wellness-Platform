import { useState } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_URL } from "@/lib/backend";

type Status = { kind: "idle" | "sending" | "sent" | "error"; text?: string };

const LINKS = [
  { label: "Email", value: "saathvikk202@gmail.com", href: "mailto:saathvikk202@gmail.com" },
  { label: "GitHub", value: "saathvik-codes", href: "https://github.com/saathvik-codes" },
  { label: "LinkedIn", value: "Saathvik Kalepu", href: "https://www.linkedin.com/in/saathvik-kalepu-17041228b/" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ kind: "sending" });
    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Could not send your message.");
      setStatus({ kind: "sent" });
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus({ kind: "error", text: `${err?.message || "Could not send your message."} You can also email directly.` });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="container mx-auto grid gap-14 px-6 py-16 lg:grid-cols-[1fr_1.1fr]">
        <section>
          <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">Get in touch</h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-foreground/75">
            Questions, feedback or a bug to report? Send a message and it will be read. Replies usually take a day or two.
          </p>
          <img src="/illustrations/sn-contact.webp" alt="" width={320} height={320} loading="lazy"
            onError={(e) => { e.currentTarget.style.display = "none"; }} className="illus mt-8 h-auto w-56" />
          <dl className="mt-8 space-y-4 border-t border-border pt-6">
            {LINKS.map((l) => (
              <div key={l.label} className="flex gap-6">
                <dt className="w-20 text-sm text-muted-foreground">{l.label}</dt>
                <dd><a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline">{l.value}</a></dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-md rounded-xl border border-border bg-card p-4 text-sm leading-6 text-foreground/80">
            This form is not watched around the clock. If you are in crisis, please use{" "}
            <Link to="/emergency-help" className="font-semibold text-accent underline underline-offset-4">immediate help</Link>.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
          {status.kind === "sent" ? (
            <div className="py-10 text-center">
              <h2 className="font-display text-2xl font-semibold text-foreground">Message sent</h2>
              <p className="mt-3 text-foreground/70">Thank you. You will hear back by email.</p>
              <Button variant="outline" className="mt-6" onClick={() => setStatus({ kind: "idle" })}>Send another</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="c-name">Name</Label>
                <Input id="c-name" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-email">Email</Label>
                <Input id="c-email" type="email" required maxLength={200} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-message">Message</Label>
                <Textarea id="c-message" required rows={7} maxLength={4000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              {status.kind === "error" && <p className="text-sm text-destructive">{status.text}</p>}
              <Button type="submit" className="w-full" disabled={status.kind === "sending"}>
                {status.kind === "sending" ? "Sending..." : "Send message"}
              </Button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
