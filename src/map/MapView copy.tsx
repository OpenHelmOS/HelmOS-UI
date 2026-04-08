import helmosOfflineStyle from "./styles/Helmos_offline_style.json";
import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapView() {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      center: [25.53795, 61.0912],
      zoom: 12,

      // ✅ täysin tyhjä ja turvallinen style
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: "background",
            type: "background",
            paint: { "background-color": "#ffffff" }
          }
        ]
      }
    });

    map.on("load", () => {

      /* =====================================================
         SOURCES
         ===================================================== */

      // OpenStreetMap (finland.mbtiles)
      map.addSource("osm", {
        type: "vector",
        url: "http://localhost:8080/data/finland.json"
      });

      // Vesijärvi syvyydet
      map.addSource("depth", {
        type: "vector",
        url: "http://localhost:8080/data/vesijarvi.json"
      });

      // OpenSeaMap (raster)
      map.addSource("seamarks", {
        type: "raster",
        tiles: [
          "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
        ],
        tileSize: 256
      });

    /* =====================================================
         LAYERS
       ===================================================== */

    /* =====================================================
        WATER – järvet ja meri
        ===================================================== */
      map.addLayer({
        id: "osm-water",
        type: "fill",
        source: "osm",
        "source-layer": "water",
        paint: {
          "fill-color": "#bcd9ea"
        }
      });

    /* =====================================================
        DEPTH AREAS – syvyysalueet
      ===================================================== */
      map.addLayer({
        id: "depth-areas",
        type: "fill",
        source: "depth",
        "source-layer": "DepthArea_APolygon",
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "depth_vis"],
            0, "#b7e4f8",
            3, "#8fd3f4",
            6, "#69c2e6",
            10, "#44a7d8",
            20, "#2b8ac6"
          ],
          "fill-opacity": 0.75
        }
      });

/* =====================================================
         OSM LANDUSE – asutus, pellot, puistot
         ===================================================== */
      map.addLayer({
        id: "osm-landuse",
        type: "fill",
        source: "osm",
        "source-layer": "landuse",
        paint: {
          "fill-color": [
            "match",
            ["get", "class"],
            "park", "#b7ddb0",
            "residential", "#e3dbe3",
            "industrial", "#d8d2d2",
            "commercial", "#d8d2d2",
            "farmland", "#e7e3d4",
            "meadow", "#e7e3d4",
            "#e7e3d4"
          ]
        }
      });

      /* =====================================================
         OSM LANDCOVER – metsät, luonnonalueet
         ===================================================== */
      map.addLayer({
        id: "osm-landcover",
        type: "fill",
        source: "osm",
        "source-layer": "landcover",
        paint: {
          "fill-color": "#cfe6c3"
        }
      });

      /* =====================================================
         DEPTH CONTOURS – syvyyskäyrät
         ===================================================== */
      map.addLayer({
        id: "depth-contours",
        type: "line",
        source: "depth",
        "source-layer": "DepthContour_LLine",
        paint: {
          "line-color": "#6b3f3f",
          "line-width": 0.5
        }
      });

      /* =====================================================
         DEPTH LABELS – syvyysnumerot
         ===================================================== */
      map.addLayer({
        id: "depth-labels",
        type: "symbol",
        source: "depth",
        "source-layer": "DepthContour_LLine",
        layout: {
          "symbol-placement": "line",
          "text-field": ["to-string", ["get", "VALDCO"]],
          "text-size": 12
        },
        paint: {
          "text-color": "#4a0000",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.5
        }
      });

      /* =====================================================
         WATERWAYS – joet ja purot
         ===================================================== */
      map.addLayer({
        id: "osm-waterway",
        type: "line",
        source: "osm",
        "source-layer": "waterway",
        paint: {
          "line-color": "#9ecae1",
          "line-width": 1
        }
      });

      /* =====================================================
         ROADS – tiet
         ===================================================== */
      map.addLayer({
        id: "osm-roads",
        type: "line",
        source: "osm",
        "source-layer": "transportation",
        paint: {
          "line-color": "#ffffff",
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8, 0.3,
            12, 1.2,
            15, 3
          ]
        }
      });

      /* =====================================================
         PLACE NAMES
         ===================================================== */
      map.addLayer({
        id: "osm-place-names",
        type: "symbol",
        source: "osm",
        "source-layer": "place",
        layout: {
          "text-field": ["get", "name:latin"],
          "text-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            6, 10,
            12, 14
          ]
        },
        paint: {
          "text-color": "#5c5c5c",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.2
        }
      });

      /* =====================================================
         ROAD NAMES
         ===================================================== */
      map.addLayer({
        id: "osm-road-names",
        type: "symbol",
        source: "osm",
        "source-layer": "transportation_name",
        layout: {
          "symbol-placement": "line",
          "text-field": ["get", "name:latin"],
          "text-size": 11
        },
        paint: {
          "text-color": "#444",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1
        }
      });

      /* =====================================================
         OPENSEAMAP – seamarks viimeisenä
         ===================================================== */
      map.addLayer({
        id: "openseamap",
        type: "raster",
        source: "seamarks",
        paint: {
          "raster-opacity": 0.8
        }
      });

    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh"
      }}
    />
  );
}