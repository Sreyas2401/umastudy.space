import { useRef, useCallback } from 'react';
import { GeoJSONFeature } from 'mapbox-gl';
import { BLDG_PARTS, BLDG_IDS } from '../utils/buildingMap';

export const useBuildingSelection = (mapRef: React.MutableRefObject<mapboxgl.Map | null>) => {
    const selectedFeatureRef = useRef<GeoJSONFeature | null>(null);

    const deselectCurrentBuilding = useCallback(() => {
        const map = mapRef.current;
        const currentFeature = selectedFeatureRef.current;
        console.log(currentFeature);

        if (!map || !currentFeature || currentFeature.id === undefined) return;

        const res = BLDG_PARTS[currentFeature.id];

        if (res && currentFeature.source) {
            const other_ids = BLDG_IDS[res];
            other_ids.forEach(cur_id => map.setFeatureState({
                id: cur_id,
                source: currentFeature.source,
                sourceLayer: currentFeature.sourceLayer
            }, { hover: false }));
        } else {
            map.setFeatureState({
                source: currentFeature.source,
                sourceLayer: currentFeature.sourceLayer,
                id: currentFeature.id
            }, { hover: false });
        }

        selectedFeatureRef.current = null;
    }, []);

    const selectBuilding = useCallback((feature: GeoJSONFeature) => {
        const map = mapRef.current;
        if (!map || feature.id === undefined) return;

        // Deselect current building if any
        deselectCurrentBuilding();

        // Update the selected feature reference
        selectedFeatureRef.current = feature;
        console.log([feature.source, feature.sourceLayer, feature.id]);

        const res = BLDG_PARTS[feature.id];

        if (res && feature.source) {
            const other_ids = BLDG_IDS[res];
            other_ids.forEach(cur_id => map.setFeatureState({
                id: cur_id,
                source: feature.source,
                sourceLayer: feature.sourceLayer
            }, { hover: true }));
        } else {
            map.setFeatureState({
                source: feature.source,
                sourceLayer: feature.sourceLayer,
                id: feature.id
            }, { hover: true });
        }
    }, [deselectCurrentBuilding]);

    // Helper function to select building by ID (useful for search)
    const selectBuildingById = useCallback((buildingId: string) => {
        const map = mapRef.current;
        if (!map) return;

        const feature: GeoJSONFeature = {
            id: buildingId,
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: {},
            source: 'composite',
            sourceLayer: 'building'
        };

        selectBuilding(feature);
    }, [selectBuilding]);

    return {
        selectBuilding,
        deselectBuilding: deselectCurrentBuilding,
        selectBuildingById,
        currentSelectedFeature: selectedFeatureRef.current
    };
};