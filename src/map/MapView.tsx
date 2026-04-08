import { useEffect, useRef } from "react";
import maplibregl, { Map, type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import helmosOfflineStyle from "./styles/Helmos_offline_style.json";

export default function MapView() {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    
    const styleWithAbsoluteSprite = {
        ...helmosOfflineStyle,
        sprite: new URL("/sprites/sprite", window.location.origin).toString()
    } as unknown as StyleSpecification;


    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleWithAbsoluteSprite,
      center: [25.53795, 61.0912],
      zoom: 12
    });

    map.on("styleimagemissing", (e) => {
      console.warn("STYLE IMAGE MISSING:", e.id);
    });

    mapRef.current = map;
  }, []);


  
  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
}