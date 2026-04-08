import { useEffect, useRef, useState } from "react";
import maplibregl, { Map, type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";


import helmosOfflineStyle from "./styles/Helmos_offline_style.json";
import { TopHud } from "../hud/TopHud";
import { BottomLeftInfo } from "../hud/BottomLeftInfo";
import { CenterCrosshair } from "../hud/CenterCrosshair";

export default function MapView() {
  
  const [center, setCenter] = useState({
    lat: 0,
    lon: 0,
  });

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
      zoom: 12,
    });
    
    const updateCenterFromScreen = () => {
      if (!mapRef.current) return;

      const map = mapRef.current;

      // Hae kartan canvas
      const canvas = map.getCanvas();
      const rect = canvas.getBoundingClientRect();

      // Ruudun keskikohta pikseleinä
      const screenX = rect.width / 2;
      const screenY = rect.height / 2;

      // UNPROJECT -> lat/lon
      const lngLat = map.unproject([screenX, screenY]);

      setCenter({
        lat: lngLat.lat,
        lon: lngLat.lng,
      });
    };

    map.on("move", updateCenterFromScreen);
    map.on("load", updateCenterFromScreen);

    map.on("load", () => {
      // Pakotetaan resize seuraavassa frameissa
      requestAnimationFrame(() => map.resize());
    });

    mapRef.current = map;
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
        }}
      />

      <CenterCrosshair />
      <TopHud />
      <BottomLeftInfo lat={center.lat} lon={center.lon} />
    </>
  );
}
