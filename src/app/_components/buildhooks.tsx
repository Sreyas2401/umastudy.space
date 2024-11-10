import { useRef, useCallback, useState } from "react";
import { type GeoJSONFeature } from "mapbox-gl";
import { BLDG_PARTS, BLDG_IDS, REVERSED_BLDG_NAMES } from "../utils/buildingMap";
import BUILD_COORDS from "../../../public/building_coords";
import { BLDG_CODES, BLDG_NAMES } from "scripts/common";

export const useBuildingSelection = (
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
) => {
  const selectedFeatureRef = useRef<GeoJSONFeature | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const deselectCurrentBuilding = useCallback(() => {
    const map = mapRef.current;
    const currentFeature = selectedFeatureRef.current;

    if (!map || currentFeature?.id === undefined) return;

    const res = BLDG_PARTS[currentFeature.id];

    if (res && currentFeature.source) {
      const other_ids = BLDG_IDS[res];
      other_ids.forEach((cur_id) =>
        map.setFeatureState(
          {
            id: cur_id,
            source: currentFeature.source,
            sourceLayer: currentFeature.sourceLayer,
          },
          { hover: false },
        ),
      );
    } else {
      map.setFeatureState(
        {
          source: currentFeature.source,
          sourceLayer: currentFeature.sourceLayer,
          id: currentFeature.id,
        },
        { hover: false },
      );
    }

    selectedFeatureRef.current = null;
  }, [mapRef]);

  const selectBuilding = useCallback(
    (feature: GeoJSONFeature) => {
      const map = mapRef.current;
      if (!map || feature.id === undefined) return;


      // Deselect current building if any
      deselectCurrentBuilding();

      // Update the selected feature reference
      selectedFeatureRef.current = feature;
      console.log(feature);

      const res = BLDG_PARTS[feature.id];

      if (res && feature.source) {
        setSelectedBuilding(res);
        const other_ids = BLDG_IDS[res];
        other_ids.forEach((cur_id) =>
          map.setFeatureState(
            {
              id: cur_id,
              source: feature.source,
              sourceLayer: feature.sourceLayer,
            },
            { hover: true },
          ),
        );
      }
    },
    [deselectCurrentBuilding, mapRef],
  );

  const selectBuildingById = useCallback(
    (buildingId: string) => {
      const map = mapRef.current;
      if (!map) return;
  
      const feature: GeoJSONFeature = {
        id: buildingId,
        type: "Feature",
        geometry: { type: "Point", coordinates: [0, 0] },
        properties: {},
        source: "composite",
        sourceLayer: "building",
      };
  
      selectBuilding(feature);

      const abbr = BLDG_PARTS[buildingId]!

      const ff = BLDG_NAMES[abbr];

      const cur_coords = BUILD_COORDS.features.find(
        (f) => f.properties.name === ff
      )?.geometry.coordinates;

      if(cur_coords!=undefined){
        console.log(ff+':'+cur_coords);
        onSelectCity({latitude: cur_coords[1]!, longitude: cur_coords[0]!});
      }

      

    },
    [selectBuilding, mapRef]
  );
  
  const onSelectCity = useCallback(({longitude, latitude}: { longitude: number; latitude: number; }) => {
    mapRef.current?.flyTo({center: [longitude, latitude], duration: 2000, pitch: 60, bearing: 35, zoom: 16.5});
  }, []);
  

  return {
    selectBuilding,
    deselectBuilding: deselectCurrentBuilding,
    selectBuildingById,
    currentSelectedFeature: selectedFeatureRef.current,
    selectedBuilding,
  };
};
