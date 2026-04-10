import { useEffect, useRef, useState } from "react";
import maplibregl, { Map, type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import helmosOfflineStyle from "./styles/Helmos_offline_style.json";

import { TopHud } from "../hud/TopHud";
import { CenterCrosshair } from "../hud/CenterCrosshair";
import { LeftHud } from "../hud/LeftHud";
import { RightHud } from "../hud/RightHud";

/* ============================================================================
   1. DEMO / DATA-LÄHTEET
   --------------------------------------------------------------------------
   Tässä määritellään _mistä data tulee_.
   Myöhemmin nämä korvautuvat GPS/IMU-datalla.
============================================================================ */

const DEMO_BOAT = {
  coordinates: [25.63083, 61.02685] as [number, number],
  heading: 0, // astetta, 0 = pohjoinen
};

/* ============================================================================
   2. APUTOIMINNOT (PUHDAS LOGIIKKA)
   --------------------------------------------------------------------------
   - Ei Reactia
   - Ei MapLibreä
   - Vain matematiikkaa
   Jos tämä olisi kirjastossa, se toimisi silti.
============================================================================ */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpAngle(a: number, b: number, t: number) {
  const delta = ((b - a + 540) % 360) - 180;
  return (a + delta * t + 360) % 360;
}

function angleDiff(a: number, b: number) {
  return Math.abs(((a - b + 540) % 360) - 180);
}

/* ============================================================================
   3. MAPVIEW-KOMPONENTTI
============================================================================ */

export default function MapView() {

  /* ------------------------------------------------------------------------
     3.1 REFS – IMPERATIIVISET OBJEKTIT
     ------------------------------------------------------------------------
     - useRef EI aiheuta re-renderiä
     - Käytetään kun:
       • käsitellään MapLibreä
       • tehdään animaatioita (RAF)
  ------------------------------------------------------------------------ */

  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Kameraa varten silotellut arvot
  const cameraRef = useRef({
    lon: DEMO_BOAT.coordinates[0],
    lat: DEMO_BOAT.coordinates[1],
    bearing: DEMO_BOAT.heading,
  });

  /* ------------------------------------------------------------------------
     3.2 STATE – "MIKÄ ON TOTTA JUURI NYT"
     ------------------------------------------------------------------------
     State = sovelluksen todellisuus
     Jos tämä muuttuu → React päivittyy
  ------------------------------------------------------------------------ */

  // Keskipiste HUDin ristille
  const [center, setCenter] = useState({ lat: 0, lon: 0 });

  // Veneen tila (myöhemmin oikea GPS)
  const [boat, setBoat] = useState(DEMO_BOAT);

  // Katselutila: miltä kartta näyttää
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");

  // Kameran tila: seuranta tai pohjoinen ylöspäin
  const [cameraMode, setCameraMode] = useState<"follow" | "north-up">("north-up");

  const mapReadyRef = useRef(false)

  const isUserInteractingRef = useRef(false);

  /* ------------------------------------------------------------------------
     3.3 EVENT HANDLERIT – UI → INTENTIO
     ------------------------------------------------------------------------
     Event handler:
     - tapahtuu napin painalluksesta
     - yksi kertatoiminto
     - EI jatkuvaa logiikkaa
  ------------------------------------------------------------------------ */

  const onZoomIn = () => {
    mapRef.current?.zoomIn({ animate: true });
  };

  const onZoomOut = () => {
    mapRef.current?.zoomOut({ animate: true });
  };

  const toggleViewMode = () => {
    const map = mapRef.current;
    if (!map) return;

    if (viewMode === "2d") {
      setViewMode("3d");
      map.easeTo({ pitch: 60, duration: 400 });
    } else {
      setViewMode("2d");
      map.easeTo({ pitch: 0, duration: 400 });
    }
  };
  
    
  const toggleFollow = () => {
    setCameraMode(prev =>
      prev === "follow" ? "north-up" : "follow"
    );
  };


  const findBoat = () => {
    const map = mapRef.current;
    if (!map) return;

    map.flyTo({
      center: boat.coordinates,
      bearing: map.getBearing(),
      pitch: map.getPitch(),
      duration: 600,
    });
  };

  /* ------------------------------------------------------------------------
     3.4 EFFECT – FOLLOW MODE (JATKUVA KÄYTÖS)
     ------------------------------------------------------------------------
     useEffect:
     - reagoi STATEEN
     - ei välitä UI-tapahtumista
     - pyörii vain kun isFollowing === true
  ------------------------------------------------------------------------ */


  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapReadyRef.current) return;
    if (cameraMode !== "follow") return;

    const map = mapRef.current!;
    const cam = cameraRef.current;

    const lonDelta = Math.abs(cam.lon - boat.coordinates[0]);
    const latDelta = Math.abs(cam.lat - boat.coordinates[1]);
    const bearingDelta = angleDiff(cam.bearing, boat.heading);

    const POSITION_DEADZONE = 0.00002;
    const BEARING_DEADZONE = 1.5;

    if (
      lonDelta < POSITION_DEADZONE &&
      latDelta < POSITION_DEADZONE &&
      bearingDelta < BEARING_DEADZONE
    ) {
      return;
    }

    cam.lon = lerp(cam.lon, boat.coordinates[0], 0.2);
    cam.lat = lerp(cam.lat, boat.coordinates[1], 0.2);
    cam.bearing = lerpAngle(cam.bearing, boat.heading, 0.2);

    map.jumpTo({
      center: [cam.lon, cam.lat],
      bearing: cam.bearing,
    });
  }, [boat.coordinates, boat.heading, cameraMode]);


  /* ------------------------------------------------------------------------
     3.4.1 EFFECT – FOLLOW MODE (KARTAN SIIRTO)
     ------------------------------------------------------------------------
     - Katkaisee Follow-tilan kun siirtää karttaa
  ------------------------------------------------------------------------ */
  
    
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const stopFollow = (e?: any) => {
      if (cameraMode !== "follow") return;
      if (e?.originalEvent) {
        setCameraMode("north-up");
      }
    };

    map.on("dragstart", stopFollow);
    map.on("wheel", stopFollow);
    map.on("pitchstart", stopFollow);
    map.on("rotatestart", stopFollow);

    return () => {
      map.off("dragstart", stopFollow);
      map.off("wheel", stopFollow);
      map.off("pitchstart", stopFollow);
      map.off("rotatestart", stopFollow);
    };
  }, [cameraMode]);


  /* ------------------------------------------------------------------------
     3.5 EFFECT – KARTAN ALUSTUS
     ------------------------------------------------------------------------
     - ajetaan VAIN kerran
     - luo kartan, layerit ja demodatan
  ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const styleWithSprite = {
      ...helmosOfflineStyle,
      sprite: new URL("/sprites/sprite", window.location.origin).toString(),
    } as unknown as StyleSpecification;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleWithSprite,
      center: [25.53795, 61.0912],
      zoom: 12,
      attributionControl: false,
    });

    // Päivitetään crosshair-koordinaatit
    const updateCenterFromScreen = () => {
      const rect = map.getCanvas().getBoundingClientRect();
      const lngLat = map.unproject([rect.width / 2, rect.height / 2]);
      setCenter({ lat: lngLat.lat, lon: lngLat.lng });
    };

    map.on("move", updateCenterFromScreen);

    map.on("load", () => {
      map.resize();
      updateCenterFromScreen();

      mapReadyRef.current = true;

      // Veneen symboli
      map.addSource("boat", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: { heading: 0 },
          geometry: {
            type: "Point",
            coordinates: DEMO_BOAT.coordinates,
          },
        },
      });

      
      map.on("dragstart", () => {
        isUserInteractingRef.current = true;
      });

      map.on("dragend", () => {
        isUserInteractingRef.current = false;
      });

      map.on("wheel", () => {
        isUserInteractingRef.current = true;
        window.clearTimeout((map as any)._wheelTimeout);
        (map as any)._wheelTimeout = window.setTimeout(() => {
          isUserInteractingRef.current = false;
        }, 300);
      });


      map.addLayer({
        id: "boat-layer",
        type: "symbol",
        source: "boat",
        layout: {
          "icon-image": "bell_tower",
          "icon-size": 2,
          "icon-rotate": ["get", "heading"],
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
        },
      });

      map.flyTo({ center: DEMO_BOAT.coordinates, zoom: 14 });

      // Demo-heading RAFilla
      let heading = 0;

      const updateBoat = () => {
        heading = (heading + 0.2) % 360;

        setBoat((prev) => ({ ...prev, heading }));

        const source = map.getSource("boat") as maplibregl.GeoJSONSource;
        source?.setData({
          type: "Feature",
          properties: { heading },
          geometry: {
            type: "Point",
            coordinates: DEMO_BOAT.coordinates,
          },
        });

        requestAnimationFrame(updateBoat);
      };

      requestAnimationFrame(updateBoat);
    });

    // Seuranta katkeaa, jos käyttäjä liikuttaa karttaa

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null; // 👈 KRIITTINEN
      mapReadyRef.current = false;
    };
  }, []);

  /* ------------------------------------------------------------------------
     3.6 RENDER – PUHDAS JSX
     ------------------------------------------------------------------------
     Ei logiikkaa.
     Ei state-muutoksia.
     Vain komponenttien kokoaminen.
  ------------------------------------------------------------------------ */

  return (
    <div className="map-view-root">
      <div ref={containerRef} className="map-canvas" />

      <CenterCrosshair />
      <TopHud />

      <LeftHud center={center} />

      <RightHud
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        viewMode={viewMode}
        onToggleViewMode={toggleViewMode}
        isFollowing={cameraMode === "follow"}
        onFindBoat={findBoat}
        onToggleFollow={toggleFollow}
      />
    </div>
  );
}