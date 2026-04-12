import { useEffect, useRef } from "react";

export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  description?: string;
  type?: "campus" | "office";
}

interface CampusMapProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  className?: string;
  height?: string;
}

export function CampusMap({ center, zoom = 14, markers = [], className = "", height = "400px" }: CampusMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let L: typeof import("leaflet");
    let map: import("leaflet").Map;

    import("leaflet").then((mod) => {
      L = mod.default ?? mod;

      // Fix default icon path issues with bundlers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapRef.current) return;
      map = L.map(mapRef.current).setView(center, zoom);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markers.forEach((m) => {
        const campusIcon = L.divIcon({
          html: `<div style="background:${m.type === "office" ? "#C9A227" : "#1A5C38"};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
          className: "",
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });
        const marker = L.marker([m.lat, m.lng], { icon: campusIcon }).addTo(map);
        if (m.title) {
          marker.bindPopup(`<strong>${m.title}</strong>${m.description ? "<br/><span style='font-size:12px;color:#555'>" + m.description + "</span>" : ""}`);
        }
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as import("leaflet").Map).remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ height }} className={`rounded-xl overflow-hidden border border-gray-200 ${className}`}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
