import { useEffect, useRef, useState } from "react";
import maplibregl, { Map, type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import helmosOfflineStyle from "./styles/Helmos_offline_style.json";

import { TopHud } from "../hud/TopHud";
import { CenterCrosshair } from "../hud/CenterCrosshair";
import { LeftHud } from "../hud/LeftHud";
import { RightHud } from "../hud/RightHud";

export default function MapView() {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [center, setCenter] = useState({ lat: 0, lon: 0 });

  const onZoomIn = () => {
    mapRef.current?.zoomIn({ animate: true });
  };

  const onZoomOut = () => {
    mapRef.current?.zoomOut({ animate: true });
  };

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
      attributionControl: false,
    });

    const updateCenterFromScreen = () => {
      const canvas = map.getCanvas();
      const rect = canvas.getBoundingClientRect();

      const lngLat = map.unproject([
        rect.width / 2,
        rect.height / 2,
      ]);

      setCenter({
        lat: lngLat.lat,
        lon: lngLat.lng,
      });
    };

    map.on("move", updateCenterFromScreen);
    map.on("load", () => {
      requestAnimationFrame(() => {
        map.resize();
        updateCenterFromScreen();
      });
    });

    mapRef.current = map;
  }, []);

  return (
    <div className="map-view-root">
      <div ref={containerRef} className="map-canvas" />

      <CenterCrosshair />
      <TopHud />

      {/* LEFT HUD */}
      <LeftHud center={center} />


      {/* RIGHT HUD */}
      <RightHud onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
      
    </div>
    
  );
}