import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import {
  Music,
  Play,
  ArrowLeft,
  Search,
  Heart,
  ExternalLink,
  Clock,
  Users,
  Sparkles,
  Volume2,
  Headphones,
  MoonStar,
  Leaf,
  Target,
  SunMedium,
  Waves,
  Wind,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  searchWellnessPlaylists,
  getWellnessCategories,
  getPlaylistTracks,
  formatDuration,
  type SpotifyPlaylist,
  type SpotifyTrack,
} from "@/lib/spotifyService";
import SpotifyPlayer from "@/components/SpotifyPlayer";

const SpotifyWellness = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = getWellnessCategories();
  const categoryIcons = {
    anxiety: Heart,
    meditation: Sparkles,
    sleep: MoonStar,
    stress: Leaf,
    focus: Target,
    mood: SunMedium,
    nature: Waves,
    yoga: Wind,
  } as const;

  useEffect(() => {
    if (selectedCategory) {
      loadPlaylists(selectedCategory);
    }
  }, [selectedCategory]);

  const loadPlaylists = async (categoryId: string) => {
    setIsLoading(true);
    const category = categories.find((c) => c.id === categoryId);
    
    if (category) {
      try {
        const results = await searchWellnessPlaylists(category.query);
        setPlaylists(results);
        
        if (results.length === 0) {
          toast({
            title: "No Playlists Found",
            description: `No playlists loaded for ${category.name}. Try another category or a custom search.`,
          });
        }
      } catch (error) {
        console.error("Error loading playlists:", error);
        toast({
          title: "Loading Failed",
          description: "Unable to load playlists right now. Try again in a moment.",
          variant: "destructive",
        });
        setPlaylists([]);
      }
    }
    
    setIsLoading(false);
  };

  const handlePlaylistClick = async (playlist: SpotifyPlaylist) => {
    setSelectedPlaylist(playlist);
    setIsLoading(true);
    const playlistTracks = await getPlaylistTracks(playlist.id);
    setTracks(playlistTracks);
    setIsLoading(false);
    
    // Activate player if tracks have previews
    const hasPreview = playlistTracks.some(track => track.previewUrl);
    if (hasPreview) {
      setIsPlayerActive(true);
      toast({
        title: "Player Ready",
        description: "Click play to start listening!",
      });
    } else {
      toast({
        title: "No Previews Available",
        description: "This playlist doesn't have preview clips. Open in Spotify to listen.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Empty Search",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setSelectedCategory(null);
    
    try {
      const results = await searchWellnessPlaylists(searchQuery);
      setPlaylists(results);
      
      if (results.length === 0) {
        toast({
          title: "No Results",
          description: `No playlists matched "${searchQuery}". Try a broader mood or activity keyword.`,
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${results.length} playlists for "${searchQuery}"`,
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: "Unable to search playlists. Please check your connection and try again.",
        variant: "destructive",
      });
      setPlaylists([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayOnSpotify = (url: string) => {
    window.open(url, "_blank");
    toast({
      title: "Opening Spotify",
      description: "Launching your playlist in Spotify...",
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#0d1110,#111915,#1b291f)] pb-16 lg:pb-0">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-green-500/15 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />
      </div>
      
      <div className={`relative z-10 container mx-auto px-4 sm:px-6 py-4 sm:py-8 ${isPlayerActive ? 'pb-40 lg:pb-40' : ''}`}>
        {/* Header - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="text-white hover:text-green-400 hover:bg-green-950/50"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div className="flex items-center gap-1.5">
                <Music className="w-5 h-5 text-green-500" />
                <span className="text-sm font-bold text-white">Spotify</span>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-white hover:text-green-400 hover:bg-green-950/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Music className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-white">Powered by Spotify</span>
            </div>
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:mb-12 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-medium text-green-200">
                <Music className="h-4 w-4" />
                Spotify wellness space
              </div>
              <h1 className="mt-5 bg-gradient-to-r from-green-200 via-green-400 to-emerald-300 bg-clip-text text-3xl font-semibold text-transparent sm:text-5xl">
                Music for calmer routines, focus resets, and slower evenings.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Browse mood-led playlists, open full songs in Spotify, and use preview clips here when they are available.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Live search</div>
                <div className="mt-3 text-2xl font-semibold text-white">Spotify-backed</div>
                <p className="mt-2 text-sm text-slate-300">Search runs through your backend so the client secret stays out of the browser bundle.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Fallback playlists</div>
                <div className="mt-3 text-2xl font-semibold text-white">Always something to open</div>
                <p className="mt-2 text-sm text-slate-300">If Spotify search is unavailable, curated wellness playlists still populate the experience.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                placeholder="Search for playlists (e.g., 'calm', 'focus', 'sleep')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500 focus:border-green-500"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-green-500 font-semibold text-black hover:bg-green-400"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Categories */}
        {!selectedPlaylist && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-green-500" />
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className={`cursor-pointer overflow-hidden rounded-[1.6rem] border transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "border-green-400/60 bg-green-500/15 shadow-[0_18px_40px_rgba(34,197,94,0.24)]"
                      : "border-white/10 bg-white/5 hover:border-green-400/30 hover:bg-white/10"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                        {(() => {
                          const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || Music;
                          return <Icon className="h-6 w-6 text-green-300" />;
                        })()}
                      </div>
                    </div>
                    <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                    <p className="text-xs text-slate-300">{category.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Playlists Grid */}
        {!selectedPlaylist && playlists.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name
                : "Search Results"}
            </h2>
            {isLoading ? (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse rounded-[1.6rem] border-white/10 bg-white/5">
                    <div className="h-48 rounded-t-[1.6rem] bg-white/10" />
                    <CardContent className="p-4">
                      <div className="mb-2 h-4 rounded bg-white/10" />
                      <div className="h-3 rounded bg-white/10" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {playlists.map((playlist) => (
                  <Card
                    key={playlist.id}
                    className="group cursor-pointer overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_18px_40px_rgba(34,197,94,0.18)]"
                    onClick={() => handlePlaylistClick(playlist)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={playlist.image}
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-6 h-6 text-black ml-1" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-1 line-clamp-1">
                        {playlist.name}
                      </h3>
                      <p className="mb-2 line-clamp-2 text-xs text-slate-300">
                        {playlist.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Music className="w-3 h-3" />
                        <span>{playlist.trackCount} tracks</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Playlist Details */}
        {selectedPlaylist && (
          <div>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedPlaylist(null);
                setTracks([]);
              }}
              className="text-white hover:text-green-400 hover:bg-green-950/50 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Playlists
            </Button>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-1">
                <Card className="overflow-hidden rounded-[1.8rem] border border-green-500/20 bg-gradient-to-br from-white/10 to-green-900/20 backdrop-blur-xl">
                  <img
                    src={selectedPlaylist.image}
                    alt={selectedPlaylist.name}
                    className="w-full aspect-square object-cover"
                  />
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedPlaylist.name}
                    </h2>
                    <p className="mb-4 text-sm text-slate-300">
                      {selectedPlaylist.description}
                    </p>
                    <div className="mb-6 flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Music className="w-4 h-4" />
                        <span>{selectedPlaylist.trackCount} tracks</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          setIsPlayerActive(true);
                          toast({
                            title: "Player Activated",
                            description: "Music player ready at the bottom of the page!",
                          });
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
                        disabled={!tracks.some(t => t.previewUrl)}
                      >
                        <Headphones className="w-4 h-4 mr-2" />
                        Play Here (30s Previews)
                      </Button>
                      <Button
                        onClick={() => handlePlayOnSpotify(selectedPlaylist.externalUrl)}
                        variant="outline"
                        className="w-full border-green-500 text-green-300 hover:bg-green-500 hover:text-black"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in Spotify (Full Songs)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Card className="rounded-[1.8rem] border border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Music className="w-5 h-5 text-green-500" />
                      Tracks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className="w-12 h-12 bg-gray-800 rounded" />
                            <div className="flex-1">
                              <div className="h-4 bg-gray-800 rounded mb-2" />
                              <div className="h-3 bg-gray-800 rounded w-2/3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-2">
                          {tracks.map((track, index) => (
                            <div
                              key={track.id}
                            className="group flex cursor-pointer items-center gap-3 rounded-[1.2rem] p-3 transition-colors hover:bg-white/5"
                              onClick={() => handlePlayOnSpotify(track.externalUrl)}
                            >
                              <span className="text-gray-500 w-6 text-sm">{index + 1}</span>
                              <img
                                src={track.albumArt}
                                alt={track.album}
                                className="w-12 h-12 rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate group-hover:text-green-400 transition-colors">
                                  {track.name}
                                </p>
                                <p className="text-gray-400 text-sm truncate">
                                  {track.artists.join(", ")}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                {track.previewUrl && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                className="text-slate-400 hover:text-green-400"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const audio = new Audio(track.previewUrl!);
                                      audio.play();
                                      toast({
                                        title: "Preview Playing",
                                        description: "30-second preview",
                                      });
                                    }}
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </Button>
                                )}
                                <span className="text-sm text-slate-500">
                                  {formatDuration(track.duration)}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-green-400"
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedPlaylist && playlists.length === 0 && !isLoading && selectedCategory && (
          <div className="text-center py-20">
            <Music className="mx-auto mb-4 h-16 w-16 text-slate-500" />
            <h3 className="mb-2 text-xl font-semibold text-slate-300">No playlists found</h3>
            <p className="text-slate-500">Try selecting a different category or a broader search phrase.</p>
          </div>
        )}

        {/* Info Banner */}
        <Card className="mt-12 rounded-[1.8rem] border border-green-500/20 bg-gradient-to-r from-green-950/50 to-black/30 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Personalized Music Therapy
                </h3>
                <p className="text-sm text-slate-300">
                  Music can be a useful part of a wellness routine, especially when someone wants a calmer background,
                  a slower evening rhythm, or help staying focused. Use these playlists as one supportive part of your
                  routine and open them fully in Spotify whenever you want the complete listening experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Embedded Spotify Player */}
      {isPlayerActive && selectedPlaylist && tracks.length > 0 && (
        <SpotifyPlayer
          playlist={{
            id: selectedPlaylist.id,
            name: selectedPlaylist.name,
            image: selectedPlaylist.image,
          }}
          tracks={tracks}
          onClose={() => setIsPlayerActive(false)}
        />
      )}
    </div>
  );
};

export default SpotifyWellness;
