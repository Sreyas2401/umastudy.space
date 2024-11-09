"use client";

import * as React from 'react';
import Map from 'react-map-gl/maplibre';

const MainMap = () => {
    return (
        <Map
            initialViewState={{
                longitude: -72.525570,  
                latitude: 42.386780,    
                zoom: 16,               
                bearing: 45,            
                pitch: 100,              
            }}
            style={{ width: '100%', height: '100vh' }}  // Full width and height
            mapStyle="/custom_map.json"
        />
    );
}

export default MainMap;
