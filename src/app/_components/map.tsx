"use client";

import * as React from 'react';
import { useRef, useCallback, useState} from 'react';
import Map, { type MapRef, type MapLayerMouseEvent, type MapGeoJSONFeature} from 'react-map-gl/maplibre';

import ControlPanel from './control_panel';

const initialViewState = {
    longitude: -72.5295306,
    latitude: 42.3917123,
    zoom: 15.5,
    bearing: 30,
    pitch: 100 ,
};

interface BuildingProperties {
    name: string;
    
}

interface BuildingFeature {
    type: string;
    geometry: { type: string; coordinates: [number, number] };
    properties: BuildingProperties;
}

const MainMap = () => {
    const mapRef = useRef<MapRef | null>(null);
    
    const [selectedBuilding, setSelectedBuilding] = useState<{
        name: string;
        longitude: number;
        latitude: number;
    } | null>(null);

    const onClick = useCallback((event:MapLayerMouseEvent) => {
        const features: MapGeoJSONFeature[] | undefined = event.features;
        console.log(event);
    }, []);

    const onResetView = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.flyTo({
                    center: [initialViewState.longitude, initialViewState.latitude], 
                    duration: 2000, 
                    zoom: 16
                });
        }
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <Map
                ref={mapRef}
                initialViewState={initialViewState}
                style={{ width: '100%', height: '100%' }}  
                mapStyle="/custom_map.json"
                onClick={onClick}
                interactiveLayerIds={['studyspaces']}
            />

            <ControlPanel onResetView={onResetView} />
        </div>
    );
}

export default MainMap;
