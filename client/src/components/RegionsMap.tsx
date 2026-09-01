import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapMarina = { name: string; lat?: number; lng?: number };

function buildIcon() {
  return L.divIcon({
    className: "regions-map__marker-wrap",
    html: `<span class="regions-map__marker"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
}

export default function RegionsMap({ ariaLabel, marinas }: { ariaLabel: string; marinas: MapMarina[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      minZoom: 5,
    }).setView([37.9, 29.2], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const icon = buildIcon();
    const points: [number, number][] = [];
    marinas.forEach((marina) => {
      if (marina.lat === undefined || marina.lng === undefined) return;
      L.marker([marina.lat, marina.lng], { icon }).addTo(layer).bindPopup(`<strong>${marina.name}</strong>`);
      points.push([marina.lat, marina.lng]);
    });
    if (points.length > 0) {
      map.fitBounds(points, { padding: [30, 30], maxZoom: 9 });
    }
  }, [marinas]);

  return <div className="regions-map" ref={containerRef} role="img" aria-label={ariaLabel} />;
}
