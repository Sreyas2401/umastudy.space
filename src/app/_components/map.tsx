"use client";

import * as React from 'react';
import { useRef, useCallback } from 'react';
import Map, { type MapRef } from 'react-map-gl/maplibre';

import ControlPanel from './control_panel';

const initialViewState = {
    longitude: -72.5295306,
    latitude: 42.3917123,
    zoom: 16,
    bearing: 45,
    pitch: 100,
};

const MainMap = () => {
    const mapRef = useRef<MapRef | null>(null);

    // Function to reset to initial coordinates
    const onResetView = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.flyTo({ center: [initialViewState.longitude, initialViewState.latitude], duration: 2000, zoom: 16 });
        }
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <Map
                ref={mapRef}
                initialViewState={initialViewState}
                style={{ width: '100%', height: '100%' }}  
                mapStyle="/custom_map.json"
            />

            <ControlPanel onResetView={onResetView} />
        </div>
    );
}

export default MainMap;
