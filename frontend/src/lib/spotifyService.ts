export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  albumArt: string;
  duration: number;
  previewUrl: string | null;
  uri: string;
  externalUrl: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  image: string;
  trackCount: number;
  uri: string;
  externalUrl: string;
  category: string;
}

const API_BASE_URL = (import.meta.env.VITE_BACKEND_API_URL || "").replace(/\/+$/, "");

const curatedPlaylists: Record<string, SpotifyPlaylist[]> = {
  anxiety: [
    {
      id: "37i9dQZF1DWZqd5JICZI0u",
      name: "Peaceful Piano",
      description: "Relax and settle into slower piano-led reflection.",
      image: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6",
      trackCount: 175,
      uri: "spotify:playlist:37i9dQZF1DWZqd5JICZI0u",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u",
      category: "anxiety",
    },
    {
      id: "37i9dQZF1DX4sWSpwq3LiO",
      name: "Peaceful Guitar",
      description: "Soft acoustic textures for decompressing after a hard day.",
      image: "https://i.scdn.co/image/ab67706f00000002d073e656e546de0e42b6d0b7",
      trackCount: 100,
      uri: "spotify:playlist:37i9dQZF1DX4sWSpwq3LiO",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
      category: "anxiety",
    },
  ],
  meditation: [
    {
      id: "37i9dQZF1DWZeKCadgRdKQ",
      name: "Deep Focus",
      description: "Ambient and slow-building instrumentals for breath work and stillness.",
      image: "https://i.scdn.co/image/ab67706f000000029bb6af539d072de34548d15c",
      trackCount: 200,
      uri: "spotify:playlist:37i9dQZF1DWZeKCadgRdKQ",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
      category: "meditation",
    },
  ],
  sleep: [
    {
      id: "37i9dQZF1DWZd79rJ6a7lp",
      name: "Sleep",
      description: "Low-tempo ambient tracks to help the mind slow down for the night.",
      image: "https://i.scdn.co/image/ab67706f00000002b70e4f2f7d0216e3f0ecb5c7",
      trackCount: 150,
      uri: "spotify:playlist:37i9dQZF1DWZd79rJ6a7lp",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp",
      category: "sleep",
    },
  ],
  stress: [
    {
      id: "37i9dQZF1DX1s9knjP51Oa",
      name: "Chill Lofi Study Beats",
      description: "Steady instrumentals to reduce noise and gently refocus.",
      image: "https://i.scdn.co/image/ab67706f00000002d073e656e546de0e42b6d0b7",
      trackCount: 300,
      uri: "spotify:playlist:37i9dQZF1DX1s9knjP51Oa",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX1s9knjP51Oa",
      category: "stress",
    },
  ],
  focus: [
    {
      id: "37i9dQZF1DWZeKCadgRdKQ",
      name: "Deep Focus",
      description: "A reliable background for reading, planning, and calmer concentration.",
      image: "https://i.scdn.co/image/ab67706f000000029bb6af539d072de34548d15c",
      trackCount: 200,
      uri: "spotify:playlist:37i9dQZF1DWZeKCadgRdKQ",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
      category: "focus",
    },
  ],
  mood: [
    {
      id: "37i9dQZF1DX3rxVfibe1L0",
      name: "Mood Booster",
      description: "Light, uplifting tracks for when energy needs a reset.",
      image: "https://i.scdn.co/image/ab67706f00000003d9f4aa3d06f9c12c7f4f8d4d",
      trackCount: 120,
      uri: "spotify:playlist:37i9dQZF1DX3rxVfibe1L0",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0",
      category: "mood",
    },
  ],
  nature: [
    {
      id: "37i9dQZF1DX4PP3DA4J0N8",
      name: "White Noise",
      description: "Rain, wind, and texture-rich ambience for grounding background sound.",
      image: "https://i.scdn.co/image/ab67706f00000002d0e2a0f8d5f8e9d24c47cebb",
      trackCount: 90,
      uri: "spotify:playlist:37i9dQZF1DX4PP3DA4J0N8",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4PP3DA4J0N8",
      category: "nature",
    },
  ],
  yoga: [
    {
      id: "37i9dQZF1DX9uKNf5jGX6m",
      name: "Yoga & Meditation",
      description: "Flow-friendly music for mobility, stretching, and slower breathing.",
      image: "https://i.scdn.co/image/ab67706f00000002d3d0f5a0f91638c3f3f7d65f",
      trackCount: 80,
      uri: "spotify:playlist:37i9dQZF1DX9uKNf5jGX6m",
      externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DX9uKNf5jGX6m",
      category: "yoga",
    },
  ],
};

const categoryQueries = [
  { id: "anxiety", keywords: ["anxiety", "calm", "relief", "panic"] },
  { id: "meditation", keywords: ["meditation", "mindfulness", "ambient", "breath"] },
  { id: "sleep", keywords: ["sleep", "rest", "night", "relaxation"] },
  { id: "stress", keywords: ["stress", "lofi", "chill", "reset"] },
  { id: "focus", keywords: ["focus", "concentration", "study", "productivity"] },
  { id: "mood", keywords: ["mood", "happy", "uplifting", "positive"] },
  { id: "nature", keywords: ["nature", "rain", "forest", "ocean"] },
  { id: "yoga", keywords: ["yoga", "stretch", "flow", "mobility"] },
] as const;

const dedupePlaylists = (playlists: SpotifyPlaylist[]) => {
  const seen = new Set<string>();

  return playlists.filter((playlist) => {
    if (seen.has(playlist.id)) {
      return false;
    }

    seen.add(playlist.id);
    return true;
  });
};

const resolveFallbackCategory = (query: string) => {
  const lowerQuery = query.toLowerCase();

  const match = categoryQueries.find((entry) =>
    entry.keywords.some((keyword) => lowerQuery.includes(keyword))
  );

  return match?.id || "stress";
};

const getCuratedPlaylists = (query: string) => {
  const categoryId = resolveFallbackCategory(query);
  return curatedPlaylists[categoryId] || [];
};

const mapSpotifyPlaylists = (items: any[], fallbackCategory: string) =>
  items
    .filter((item) => item?.id && item?.external_urls?.spotify)
    .map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || "Spotify playlist",
      image: item.images?.[0]?.url || "https://placehold.co/600x600?text=Serenity",
      trackCount: item.tracks?.total || 0,
      uri: item.uri,
      externalUrl: item.external_urls.spotify,
      category: fallbackCategory,
    })) as SpotifyPlaylist[];

const mapSpotifyTracks = (items: any[]) =>
  items
    .filter((item) => item?.track?.id && item?.track?.external_urls?.spotify)
    .map((item) => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists.map((artist: any) => artist.name),
      album: item.track.album?.name || "Unknown album",
      albumArt: item.track.album?.images?.[0]?.url || "",
      duration: item.track.duration_ms || 0,
      previewUrl: item.track.preview_url,
      uri: item.track.uri,
      externalUrl: item.track.external_urls.spotify,
    })) as SpotifyTrack[];

const getCandidateApiBases = () => {
  const candidates = new Set<string>();

  if (API_BASE_URL) {
    candidates.add(API_BASE_URL);
  }

  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    candidates.add("http://localhost:3001");
  }

  return Array.from(candidates);
};

const fetchBackendSpotify = async (path: string) => {
  const apiBases = getCandidateApiBases();
  const errors: string[] = [];

  if (apiBases.length === 0) {
    throw new Error("Backend API URL is not configured");
  }

  for (const apiBase of apiBases) {
    try {
      const response = await fetch(`${apiBase}${path}`);

      if (!response.ok) {
        errors.push(`${apiBase} responded with ${response.status}`);
        continue;
      }

      return response.json();
    } catch (error) {
      errors.push(`${apiBase} failed: ${String(error)}`);
    }
  }

  throw new Error(errors.join(" | "));
};

export const searchWellnessPlaylists = async (query: string): Promise<SpotifyPlaylist[]> => {
  const curatedFallback = getCuratedPlaylists(query);

  try {
    const data = await fetchBackendSpotify(
      `/api/spotify/search?q=${encodeURIComponent(query)}&type=playlist&limit=20`
    );

    const playlists = mapSpotifyPlaylists(data.playlists?.items || [], resolveFallbackCategory(query));

    if (playlists.length === 0) {
      return curatedFallback;
    }

    return dedupePlaylists([...playlists, ...curatedFallback]).slice(0, 20);
  } catch (error) {
    console.error("Spotify search fallback:", error);
    return curatedFallback;
  }
};

export const getWellnessCategories = () => [
  {
    id: "anxiety",
    name: "Anxiety Relief",
    description: "Calming playlists for quieter breathing and steadier thoughts.",
    query: "anxiety relief calm meditation",
  },
  {
    id: "meditation",
    name: "Meditation",
    description: "Ambient sets for reflection, breath work, and stillness.",
    query: "meditation mindfulness ambient",
  },
  {
    id: "sleep",
    name: "Sleep",
    description: "Low-tempo sound for winding down at night.",
    query: "sleep relaxation peaceful",
  },
  {
    id: "stress",
    name: "Stress Relief",
    description: "Soft, steady tracks to decompress without overstimulation.",
    query: "stress relief lofi chill",
  },
  {
    id: "focus",
    name: "Focus",
    description: "Clean background sound for work, study, and attention resets.",
    query: "focus concentration study",
  },
  {
    id: "mood",
    name: "Mood Boost",
    description: "Lighter, brighter playlists for energy and lift.",
    query: "happy uplifting positive mood",
  },
  {
    id: "nature",
    name: "Nature Sounds",
    description: "Rain, forest, and natural texture for grounding calm.",
    query: "nature sounds rain forest",
  },
  {
    id: "yoga",
    name: "Yoga Flow",
    description: "Music that fits stretching, movement, and slow routines.",
    query: "yoga stretching flow",
  },
] as const;

export const getPlaylistTracks = async (playlistId: string): Promise<SpotifyTrack[]> => {
  try {
    const data = await fetchBackendSpotify(
      `/api/spotify/playlists/${encodeURIComponent(playlistId)}/tracks?limit=50`
    );

    return mapSpotifyTracks(data.items || []);
  } catch (error) {
    console.error("Spotify track fallback:", error);
    return [];
  }
};

export const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const getRecommendationsByMood = (mood: number): string => {
  const moodCategories: Record<number, string> = {
    1: "sleep",
    2: "anxiety",
    3: "stress",
    4: "mood",
    5: "focus",
  };

  return moodCategories[mood] || "meditation";
};
