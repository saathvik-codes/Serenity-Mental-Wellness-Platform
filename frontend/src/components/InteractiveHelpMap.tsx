import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, LocateFixed, Navigation, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/lib/backend";

type Center = {
  id: string; name: string; type: string; address?: string; phone?: string | null; website?: string | null; hours?: string | null;
  lat: number; lng: number; distance: number;
};
type Point = { lat: number; lng: number };

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const INDIA: Point = { lat: 20.5937, lng: 78.9629 };
const km = (m: number) => (m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`);
const label = (t: string) => ({ hospital: "Hospital", clinic: "Clinic", doctors: "Doctor", counselling: "Counselling", social_facility: "Support service" }[t] || "Health service");

// Moves the map when the search point or the selected place changes; reports when the user pans away.
function MapController({ target, zoom, onPan }: { target: Point | null; zoom: number; onPan: () => void }) {
  const map = useMap();
  useEffect(() => { if (target) map.flyTo([target.lat, target.lng], zoom, { duration: 0.8 }); }, [map, target, zoom]);
  useMapEvents({ dragend: onPan });
  return null;
}

export const InteractiveHelpMap = () => {
  const [origin, setOrigin] = useState<Point | null>(null);
  const [centers, setCenters] = useState<Center[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [place, setPlace] = useState("");
  const [panned, setPanned] = useState(false);
  const [focus, setFocus] = useState<{ point: Point; zoom: number } | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const requestId = useRef(0);

  const search = useCallback(async (point: Point) => {
    const id = ++requestId.current;
    setOrigin(point); setLoading(true); setError(""); setSelected(null); setPanned(false);
    setFocus({ point, zoom: 13 });
    try {
      const res = await fetch(`${BACKEND_URL}/api/help-centers?lat=${point.lat}&lng=${point.lng}`);
      const data = await res.json().catch(() => ({}));
      if (id !== requestId.current) return;
      if (!res.ok) throw new Error(data.error || "Could not load nearby services.");
      setCenters(data.centers || []);
      if (!(data.centers || []).length) setError("No hospitals or clinics are mapped near this spot. Try searching a nearby city.");
    } catch (e) {
      if (id === requestId.current) { setCenters([]); setError(e instanceof Error ? e.message : "Could not load nearby services."); }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) { setError("Your browser does not share location. Search for a city instead."); return; }
    setLoading(true); setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => void search({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => { setLoading(false); setError("Location permission was not given. Search for your city instead."); },
      { timeout: 10000, maximumAge: 300000 },
    );
  }, [search]);

  const findPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (place.trim().length < 2) return;
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/geocode?q=${encodeURIComponent(place.trim())}`);
      const data = await res.json().catch(() => ({}));
      const hit = data.places?.[0];
      if (!hit) { setLoading(false); setError(res.ok ? "We could not find that place." : data.error || "Place search is unavailable."); return; }
      await search({ lat: hit.lat, lng: hit.lng });
    } catch { setLoading(false); setError("Place search is unavailable right now."); }
  };

  const searchHere = () => { const c = mapRef.current?.getCenter(); if (c) void search({ lat: c.lat, lng: c.lng }); };
  const directions = (c: Center) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}${origin ? `&origin=${origin.lat},${origin.lng}` : ""}`, "_blank", "noopener");
  const pick = (c: Center) => { setSelected(c.id); setFocus({ point: { lat: c.lat, lng: c.lng }, zoom: 16 }); };

  // ask for the location once, politely: only when the browser has already been granted it
  useEffect(() => {
    navigator.permissions?.query({ name: "geolocation" as PermissionName }).then((p) => { if (p.state === "granted") locateMe(); }).catch(() => {});
  }, [locateMe]);

  return (
    <div className="relative h-[calc(100dvh-11rem)] min-h-[34rem] overflow-hidden rounded-2xl border border-border shadow-sm">
      <MapContainer center={[INDIA.lat, INDIA.lng]} zoom={5} className="absolute inset-0 z-0 h-full w-full" ref={mapRef} scrollWheelZoom zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap contributors &copy; CARTO" maxZoom={19} />
        <ZoomControl position="bottomright" />
        <MapController target={focus?.point ?? null} zoom={focus?.zoom ?? 13} onPan={() => setPanned(true)} />
        {origin && <Marker position={[origin.lat, origin.lng]}><Popup>Search centre</Popup></Marker>}
        {centers.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} eventHandlers={{ click: () => setSelected(c.id) }}>
            <Popup>
              <b>{c.name}</b><br />{label(c.type)} · {km(c.distance)}
              {c.hours && <><br />Hours: {c.hours}</>}
              {c.phone && <><br /><a href={`tel:${c.phone}`}>{c.phone}</a></>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* floating panel, like a maps app: search on top, results below */}
      <div className="absolute inset-x-3 bottom-3 z-[1000] flex max-h-[48%] flex-col gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur-sm lg:inset-y-3 lg:left-3 lg:right-auto lg:max-h-none lg:w-[23rem]">
        <form onSubmit={findPlace} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Search a city or area" aria-label="Search a place" className="h-10 pl-9" />
          </div>
          <Button type="button" size="icon" variant="outline" onClick={locateMe} disabled={loading} aria-label="Use my location" className="h-10 w-10 shrink-0"><LocateFixed className="h-4 w-4" /></Button>
        </form>

        <div className="min-h-0 flex-1 space-y-2 overflow-auto pr-1" aria-live="polite">
          {loading && <p className="flex items-center gap-2 py-4 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Looking for services...</p>}
          {!loading && error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          {!loading && !error && !origin && <p className="py-3 text-sm text-muted-foreground">Tap the location button or search a city to see hospitals, clinics and counselling services around it.</p>}
          {!loading && centers.length > 0 && <p className="text-xs font-medium text-muted-foreground">{centers.length} nearest services</p>}
          {!loading && centers.map((c) => (
            <div key={c.id} className={`cursor-pointer rounded-lg border p-3 transition-colors ${selected === c.id ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"}`} onClick={() => pick(c)}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0"><p className="truncate font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{label(c.type)}</p></div>
                <span className="shrink-0 text-xs font-medium text-primary">{km(c.distance)}</span>
              </div>
              {c.address && <p className="mt-1 text-xs text-muted-foreground">{c.address}</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                {c.phone && <Button size="sm" onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${c.phone}`; }}><Phone className="mr-1 h-3.5 w-3.5" />Call</Button>}
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); directions(c); }}><Navigation className="mr-1 h-3.5 w-3.5" />Directions</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {panned && !loading && (
        <Button onClick={searchHere} className="absolute left-1/2 top-3 z-[1000] -translate-x-1/2 rounded-full shadow-md lg:left-[calc(50%+11.5rem)]">Search this area</Button>
      )}
      <p className="pointer-events-none absolute bottom-1 right-14 z-[900] hidden text-[10px] text-muted-foreground lg:block">Hours and phone numbers may be missing; call ahead.</p>
    </div>
  );
};
