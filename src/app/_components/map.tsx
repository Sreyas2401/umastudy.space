"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl, { type LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ControlPanel from "./control_panel";
import { useBuildingSelection } from "./buildhooks";
import { useParams, useRouter } from "next/navigation";
import { BLDG_IDS } from "../utils/buildingMap";

const globalVar = {
  origin: [-72.52819, 42.38977, 39],
  center: { lng: -72.52819, lat: 42.38977 } as LngLatLike,
  zoom: 16.2,
  pitch: 60,
  bearing: 35,
};

function MainMap() {
  const params = useParams();
  const router = useRouter();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    selectBuilding,
    deselectBuilding,
    selectBuildingById,
    selectedBuilding,
  } = useBuildingSelection(mapRef);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZGV2ZWxvcG1lbnQ0dSIsImEiOiJjamZkeGc3Y2M0OXc0MzNwZDl3enRpbzc3In0.S95dVrY6n-TxsdzqG4dvNg";

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        zoom: globalVar.zoom,
        pitch: globalVar.pitch,
        bearing: globalVar.bearing,
        antialias: true,
        hash: true,
        center: globalVar.center,
      });

      const map = mapRef.current;

      map.on("style.load", () => {
        if (map.getSource("composite")) {
          map.addLayer(
            {
              id: "3d-buildings",
              source: "composite",
              "source-layer": "building",
              type: "fill-extrusion",
              minzoom: 14,
              paint: {
                "fill-extrusion-color": [
                  "case",
                  ["boolean", ["feature-state", "hover"], false],
                  "#ff0000",
                  "#ddd",
                ],
                "fill-extrusion-height": ["number", ["get", "height"], 5],
                "fill-extrusion-base": ["number", ["get", "min_height"], 0],
                "fill-extrusion-opacity": 1,
              },
            },
            "road-label",
          );
        }

        map.on("click", (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["3d-buildings"],
          });

          if (features[0]) {
            selectBuilding(features[0]);
          } else {
            deselectBuilding();
          }
        });

        setMapLoaded(true);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [selectBuilding, deselectBuilding]);

  useEffect(() => {
    if (!mapLoaded) return;

    if (params.bldg) {
      const id = BLDG_IDS[params.bldg as keyof typeof BLDG_IDS];
      if (id) id.forEach((i) => selectBuildingById(i));
    }
  }, [params, selectBuildingById, mapLoaded]);

  useEffect(() => {
    if (selectedBuilding) {
      router.push(`/buildings/${selectedBuilding}`);
    }
  }, [selectedBuilding, router]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ height: "100vh", width: "100%" }}
      />
      <ControlPanel
        onSelectBuilding={selectBuildingById}
        onDeselectBuilding={deselectBuilding}
      />
    </div>
  );
}

export default MainMap;
