import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Search, SkipBack, SkipForward, Volume2, VolumeX, ExternalLink, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/lib/backend";
import MobileBottomNav from "@/components/MobileBottomNav";

type Track = { id: string; title: string; artist: string; duration: number; artwork: string | null; streamUrl: string; link: string | null; preview?: boolean };

// Each mood maps to a search on Audius, where every track streams in full for free.
const MOODS = [
  { label: "Calm", q: "calm piano" },
  { label: "Sleep", q: "sleep ambient" },
  { label: "Focus", q: "lofi focus" },
  { label: "Meditation", q: "meditation music" },
  { label: "Nature", q: "nature sounds rain" },
  { label: "Uplifting", q: "uplifting acoustic" },
];

// Spotify's own player: full songs for anyone signed in to Spotify in this browser, previews otherwise.
const SPOTIFY_PLAYLISTS = [
  { id: "37i9dQZF1DWZqd5JICZI0u", name: "Peaceful Meditation" },
  { id: "37i9dQZF1DX4sWSpwq3LiO", name: "Peaceful Piano" },
  { id: "37i9dQZF1DWZeKCadgRdKQ", name: "Deep Focus" },
  { id: "37i9dQZF1DWZd79rJ6a7lp", name: "Sleep" },
  { id: "37i9dQZF1DX1s9knjP51Oa", name: "Calm Vibes" },
  { id: "37i9dQZF1DX3rxVfibe1L0", name: "Mood Booster" },
  { id: "37i9dQZF1DX4PP3DA4J0N8", name: "Nature Sounds" },
  { id: "37i9dQZF1DX9uKNf5jGX6m", name: "Yoga & Meditation" },
];

const time = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

export default function SpotifyWellness() {
  const [query, setQuery] = useState(MOODS[0].q);
  const [search, setSearch] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [length, setLength] = useState(0);
  const [muted, setMuted] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError("");
    fetch(`${BACKEND_URL}/api/music?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) { setTracks(d.tracks || []); if (!(d.tracks || []).length) setError("No tracks found for that search."); } })
      .catch(() => { if (!cancelled) setError("Music could not be loaded. Please try again in a moment."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [query]);

  const playAt = useCallback((i: number) => {
    const el = audio.current; const t = tracks[i];
    if (!el || !t) return;
    setCurrent(i);
    el.src = t.streamUrl;
    el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [tracks]);

  const toggle = () => {
    const el = audio.current; if (!el) return;
    if (current === null) return playAt(0);
    if (el.paused) el.play().then(() => setPlaying(true)).catch(() => {});
    else { el.pause(); setPlaying(false); }
  };
  const next = () => tracks.length && playAt(current === null ? 0 : (current + 1) % tracks.length);
  const prev = () => tracks.length && playAt(current === null ? 0 : (current - 1 + tracks.length) % tracks.length);
  const track = current !== null ? tracks[current] : null;

  return (
    <div className={`min-h-screen bg-background ${track ? "pb-44 lg:pb-32" : "pb-20 lg:pb-8"}`}>
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <header className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl font-semibold text-foreground">Music</h1>
            <p className="mt-2 max-w-xl text-foreground/70">Pick a mood or search any song, artist or language. Free tracks play in full; other songs play a 30-second preview.</p>
          </div>
          <img src="/illustrations/sn-music.webp" alt="" width={112} height={112} className="illus hidden h-24 w-24 object-contain sm:block" />
        </header>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {MOODS.map((m) => (
            <button key={m.q} type="button" onClick={() => { setQuery(m.q); setSearch(""); }}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${query === m.q ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground/75 hover:border-primary/40"}`}>
              {m.label}
            </button>
          ))}
          <form className="ml-auto flex w-full gap-2 sm:w-auto" onSubmit={(e) => { e.preventDefault(); if (search.trim()) setQuery(search.trim()); }}>
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search music" className="pl-9" />
            </div>
            <Button type="submit" variant="outline">Search</Button>
          </form>
        </div>

        <section className="mt-6 rounded-xl border border-border bg-card">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading tracks...</div>
          ) : error ? (
            <p className="py-16 text-center text-muted-foreground">{error}</p>
          ) : tracks.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">Nothing matched. Try an artist or song name.</p>
          ) : (
            <ol className="divide-y divide-border">
              {tracks.map((t, i) => (
                <li key={t.id}>
                  <button type="button" onClick={() => (current === i ? toggle() : playAt(i))}
                    className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-secondary/50 ${current === i ? "bg-secondary/60" : ""}`}>
                    <span className="w-6 text-center text-sm text-muted-foreground">
                      {current === i && playing ? <Pause className="mx-auto h-4 w-4 text-primary" /> : i + 1}
                    </span>
                    {t.artwork ? <img src={t.artwork} alt="" loading="lazy" className="h-11 w-11 rounded-md object-cover" /> : <div className="h-11 w-11 rounded-md bg-secondary" />}
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate font-medium ${current === i ? "text-primary" : "text-foreground"}`}>{t.title}</span>
                      <span className="block truncate text-sm text-muted-foreground">{t.artist}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-sm tabular-nums text-muted-foreground">{t.preview && <span className="rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide">Preview</span>}{time(t.duration)}</span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </section>
        <p className="mt-2 text-xs text-muted-foreground">Free tracks stream from Audius. Other songs come from Apple's catalogue as 30-second previews with a link to the full song.</p>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-foreground">Spotify playlists</h2>
          <p className="mt-1 text-sm text-muted-foreground">Signed in to Spotify in this browser? You will hear full songs. Otherwise Spotify plays 30-second previews.</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {SPOTIFY_PLAYLISTS.map((p) => (
              <iframe key={p.id} title={`Spotify playlist: ${p.name}`} src={`https://open.spotify.com/embed/playlist/${p.id}?utm_source=generator&theme=0`}
                width="100%" height="352" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-xl border-0" />
            ))}
          </div>
        </section>
      </div>

      {/* player */}
      <audio ref={audio} preload="none" muted={muted}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setLength(e.currentTarget.duration)}
        onEnded={next} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)}
        onError={() => { if (current !== null) next(); }} />
      {track && (
      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-card shadow-[0_-4px_16px_rgba(0,0,0,0.06)] lg:bottom-0 lg:left-60">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          {track.artwork ? <img src={track.artwork} alt="" className="hidden h-11 w-11 rounded-md object-cover sm:block" /> : <div className="hidden h-11 w-11 rounded-md bg-secondary sm:block" />}
          <div className="min-w-0 w-40 sm:w-56">
            <p className="truncate text-sm font-medium text-foreground">{track.title}</p>
            <p className="truncate text-xs text-muted-foreground">{track.artist}{track.preview ? " · preview" : ""}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={prev} aria-label="Previous track"><SkipBack className="h-4 w-4" /></Button>
            <Button size="icon" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="rounded-full">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={next} aria-label="Next track"><SkipForward className="h-4 w-4" /></Button>
          </div>
          <div className="hidden flex-1 items-center gap-2 md:flex">
            <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">{time(progress)}</span>
            <input type="range" min={0} max={length || 0} step={1} value={progress} aria-label="Seek"
              onChange={(e) => { if (audio.current) audio.current.currentTime = Number(e.target.value); }}
              className="h-1 flex-1 accent-[hsl(var(--primary))]" />
            <span className="w-10 text-xs tabular-nums text-muted-foreground">{time(length)}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMuted(!muted)} aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          {track.link && (
            <a href={track.link} target="_blank" rel="noreferrer" className="hidden text-muted-foreground hover:text-primary sm:block" aria-label={track.preview ? "Open full song" : "Open on Audius"}>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      )}
      <MobileBottomNav />
    </div>
  );
}
