'use client'

import { useRef, useEffect, useState } from 'react';
import mapboxgl, {GeoJSONFeature, LngLatLike} from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const globalVar = {
    origin: [-72.52819, 42.38977, 39],
    center: {lng: -72.52819, lat: 42.38977} as LngLatLike,
    zoom: 16.2,
    pitch: 60,
    bearing: 35
}

function MainMap() {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<GeoJSONFeature|null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        console.log(selectedBuilding?.id); 
    }, [selectedBuilding]);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2ZWxvcG1lbnQ0dSIsImEiOiJjamZkeGc3Y2M0OXc0MzNwZDl3enRpbzc3In0.S95dVrY6n-TxsdzqG4dvNg';

        if (mapContainerRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current, 
                style: 'mapbox://styles/mapbox/streets-v12', 
                zoom: globalVar.zoom,
                pitch: globalVar.pitch,
                bearing: globalVar.bearing,
                antialias: true, 
                hash: true, 
                center: globalVar.center
            });

            const map = mapRef.current;

            map.on('style.load', () => {
                console.log(map.getStyle());
                if(map.getSource('composite')){
                    console.log(map.getSource('composite'))
                    map.addLayer({
                        'id': '3d-buildings',
                        'source': 'composite',
                        'source-layer': 'building',
                        'type': 'fill-extrusion',
                        'minzoom': 14,
                        'paint': {
                            'fill-extrusion-color': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], false],
                                '#ff0000',
                                '#ddd'
                            ],
                            'fill-extrusion-height': ["number", ["get", "height"], 5],
                            'fill-extrusion-base': ["number", ["get", "min_height"], 0],
                            'fill-extrusion-opacity': 1
                        }
                    }, 'road-label')
                }

                let fClick: GeoJSONFeature | null = null;

                map.on('click', (e) => {
                    let features = map.queryRenderedFeatures(e.point, {
                        layers: ['3d-buildings']
                    });

                    if(features[0]){
                        deselectBuilding();
                        selectBuilding(features[0]);
                    }else{
                        deselectBuilding();
                    }
                });

                const deselectBuilding = () => {
                    if (!fClick || fClick.id === undefined) return;
                    setSelectedBuilding(null);
                    map.getCanvasContainer().style.cursor = 'default';
                    map.setFeatureState({
                        source: fClick.source,
                        sourceLayer: fClick.sourceLayer,
                        id: fClick.id
                    }, {
                        hover: false
                    });
                };

                const selectBuilding = (feature: GeoJSONFeature) => {
                    fClick = feature;
                    if (fClick.id === undefined) return;

                    setSelectedBuilding(fClick);

                    map.getCanvasContainer().style.cursor = 'pointer';

                    map.setFeatureState({
                    source: fClick.source,
                    sourceLayer: fClick.sourceLayer,
                    id: fClick.id
                    }, {
                    hover: true
                    });
                }
            });

        }



    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
        }
    };
    }, []);

    return (
        <>
            <div id='map-container' ref={mapContainerRef} style={{ height: '100vh', width: '100%' }} />
        </>
    );
}

export default MainMap;
