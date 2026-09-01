import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MarinaPoint = {
  name: string;
  lat: number;
  lng: number;
  regionId: string;
};

export const marinaPoints: MarinaPoint[] = [
  // İzmir
  { name: "Levent Marina (Üçkuyular)", lat: 38.40557, lng: 27.068329, regionId: "izmir" },
  { name: "IC Çeşme Marina", lat: 38.3212812, lng: 26.3013638, regionId: "izmir" },
  { name: "Port Alaçatı Marina", lat: 38.2553813, lng: 26.3830589, regionId: "izmir" },
  { name: "Setur Altınyunus Marina (Çeşme)", lat: 38.3223991, lng: 26.344717, regionId: "izmir" },
  { name: "Teos Marina (Seferihisar)", lat: 38.19061, lng: 26.7829494, regionId: "izmir" },
  // Muğla
  { name: "Yalıkavak Marina", lat: 37.1021029, lng: 27.284085, regionId: "mugla" },
  { name: "Milta Bodrum Marina", lat: 37.0345223, lng: 27.4221384, regionId: "mugla" },
  { name: "D-Marin Turgutreis", lat: 37.0018201, lng: 27.2580484, regionId: "mugla" },
  { name: "Aganlar Marina", lat: 37.013609, lng: 27.451611, regionId: "mugla" },
  { name: "Netsel Marmaris Marina", lat: 36.849795, lng: 28.281057, regionId: "mugla" },
  { name: "Martı Marina", lat: 36.7709288, lng: 28.1286444, regionId: "mugla" },
  { name: "Marmaris Yat Marina", lat: 36.81806, lng: 28.309449, regionId: "mugla" },
  { name: "Ecesaray Marina (Fethiye)", lat: 36.6219512, lng: 29.1014361, regionId: "mugla" },
  { name: "D-Marin Göcek", lat: 36.7464182, lng: 28.9431047, regionId: "mugla" },
  { name: "Skopea Marina (Göcek)", lat: 36.7544204, lng: 28.9391329, regionId: "mugla" },
  { name: "Kairos Marina (Datça)", lat: 36.7696882, lng: 27.6181448, regionId: "mugla" },
  // Aydın
  { name: "Setur Kuşadası Marina", lat: 37.870353, lng: 27.263935, regionId: "aydin" },
  { name: "D-Marin Didim", lat: 37.3389001, lng: 27.261605, regionId: "aydin" },
  // Antalya
  { name: "Setur Antalya Marina", lat: 36.8336938, lng: 30.6051289, regionId: "antalya" },
  { name: "G-Marina Kemer", lat: 36.599625, lng: 30.573331, regionId: "antalya" },
  { name: "Setur Kaş Marina", lat: 36.2060575, lng: 29.6283919, regionId: "antalya" },
  { name: "Setur Finike Marina", lat: 36.2933691, lng: 30.1510317, regionId: "antalya" },
  { name: "Alanya Marina", lat: 36.5601498, lng: 31.9492899, regionId: "antalya" },
  { name: "Antalya Kaleiçi Yat Limanı", lat: 36.8848919, lng: 30.7013627, regionId: "antalya" },
  // Marmara
  { name: "Ataköy Marina (İstanbul)", lat: 40.9713786, lng: 28.8744461, regionId: "marmara" },
  { name: "West İstanbul Marina", lat: 40.9635829, lng: 28.6595977, regionId: "marmara" },
  { name: "Setur Kalamış & Fenerbahçe (İstanbul)", lat: 40.976635, lng: 29.03981, regionId: "marmara" },
  { name: "Viaport Tuzla Marina (İstanbul)", lat: 40.8157795, lng: 29.3175435, regionId: "marmara" },
  { name: "Setur Yalova Marina", lat: 40.66048, lng: 29.277847, regionId: "marmara" },
  { name: "Güzelyalı Yat Limanı (Bursa/Mudanya)", lat: 40.3552837, lng: 28.9318122, regionId: "marmara" },
  { name: "Setur Ayvalık Marina (Balıkesir)", lat: 39.3129681, lng: 26.6867781, regionId: "marmara" },
];

const regionColors: Record<string, string> = {
  izmir: "#c79b48",
  mugla: "#073a6b",
  aydin: "#8a7651",
  antalya: "#1d6a5a",
  marmara: "#7a3b3b",
};

function buildIcon(color: string) {
  return L.divIcon({
    className: "regions-map__marker-wrap",
    html: `<span class="regions-map__marker" style="background:${color}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
}

export default function RegionsMap({ ariaLabel }: { ariaLabel: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

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

    marinaPoints.forEach((marina) => {
      const icon = buildIcon(regionColors[marina.regionId] ?? "#c79b48");
      L.marker([marina.lat, marina.lng], { icon }).addTo(map).bindPopup(`<strong>${marina.name}</strong>`);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div className="regions-map" ref={containerRef} role="img" aria-label={ariaLabel} />;
}
