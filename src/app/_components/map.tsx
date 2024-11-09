/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const BuildingMap = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

    useEffect(() => {
        if (map.current === null && mapContainer.current !== null) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: '/custom_map.json', 
                center: [-72.52819, 42.38977],
                zoom: 16,
                pitch: 45,
            });

            map.current.on('load', () => {
                // Add a highlight layer that uses the same source as your building-3d layer
                map.current!.addLayer({
                    id: 'building-highlight-3d',
                    type: 'fill-extrusion',
                    source: 'openmaptiles',
                    'source-layer': 'building',
                    minzoom: 14,
                    paint: {
                        'fill-extrusion-color': '#ff4444',
                        'fill-extrusion-height': ['get', 'render_height'],
                        'fill-extrusion-base': ['get', 'render_min_height'],
                        'fill-extrusion-opacity': 0.9
                    },
                    filter: ['==', ['get', 'id'], '']
                });

                // Handle clicks on study spaces
                map.current!.on('click', 'studyspaces', (e) => {
                    const feature = e.features?.[0];
                    if (feature && feature.properties?.name) {
                        const buildingName = feature?.properties?.name ?? 'Unknown Building';
                        setSelectedBuilding(buildingName);
                        
                        // Get the building footprint at the clicked point
                        const bbox: [[number, number], [number, number]] = [
                            [e.point.x - 5, e.point.y - 5],
                            [e.point.x + 5, e.point.y + 5]
                        ];
                        
                        const buildingFeatures = map.current!.queryRenderedFeatures(bbox, {
                            layers: ['building-3d']
                        });

                        if (buildingFeatures.length > 0) {
                            // Highlight the building using its ID
                            map.current!.setFilter('building-highlight-3d', [
                                '==',
                                ['get', 'id'],
                                buildingFeatures[0]?.properties?.id ?? null
                            ]);
                        }
                    } else {
                        setSelectedBuilding(null);
                        map.current!.setFilter('building-highlight-3d', ['==', ['get', 'id'], '']);
                    }
                });

                // Handle clicks directly on buildings
                map.current!.on('click', 'building-3d', (e) => {
                    if (e.features && e.features[0]) {
                        const buildingId = e.features[0]?.properties?.id ?? null;
                        
                        // Find the corresponding study space
                        const point = e.point;
                        const studyFeatures = map.current!.queryRenderedFeatures(point, {
                            layers: ['studyspaces']
                        });

                        if (studyFeatures.length > 0) {
                            setSelectedBuilding(studyFeatures[0]!.properties?.name ?? 'Unknown Building');
                        }

                        map.current!.setFilter('building-highlight-3d', [
                            '==',
                            ['get', 'id'],
                            buildingId
                        ]);
                    }
                });

                // Cursor handling
                ['studyspaces', 'building-3d'].forEach((layerId) => {
                    map.current!.on('mouseenter', layerId, () => {
                        map.current!.getCanvas().style.cursor = 'pointer';
                    });

                    map.current!.on('mouseleave', layerId, () => {
                        map.current!.getCanvas().style.cursor = '';
                    });
                });
            });
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    return (
        <div className="w-full h-screen relative">
            <div ref={mapContainer} className="w-full h-full" />
            {selectedBuilding && (
                <div className="absolute top-4 left-4 bg-white p-4 rounded shadow">
                    <h3 className="font-medium">Selected Building:</h3>
                    <p>{selectedBuilding}</p>
                </div>
            )}
        </div>
    );
};

export default BuildingMap;