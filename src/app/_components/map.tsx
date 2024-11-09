'use client'

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const BuildingMap = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

    useEffect(() => {
        // Initialize map only if map.current is null (i.e., hasn't been initialized yet)
        if (map.current === null && mapContainer.current !== null) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: '/custom_map.json', 
                center: [-72.52819, 42.38977],
                zoom: 16,
            });

            map.current.on('load', () => {
                map.current!.addSource('building-footprints', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [
                        {
                            type: 'Feature',
                            properties: {
                            name: 'W.E.B. Du Bois Library',
                            symbolId: '0',
                            },
                            geometry: {
                            type: 'Polygon',
                            coordinates: [
                                [
                                    [
                                        -72.52864085880019,
                                        42.390004269052525
                                    ],
                                    [
                                        -72.52830901773197,
                                        42.38919493341976
                                    ],
                                    [
                                        -72.52767388998264,
                                        42.389341840221306
                                    ],
                                    [
                                        -72.52796152483289,
                                        42.39016707743667
                                    ],
                                    [
                                        -72.52864085880019,
                                        42.390004269052525
                                    ]
                                ],
                            ],
                            },
                        },
                        // Additional building footprints can be added here
                        ],
                    },
                });

            map.current!.addLayer({
                id: 'building-outlines',
                type: 'line',
                source: 'building-footprints',
                minzoom: 15,
                paint: {
                    'line-color': '#666',
                    'line-width': 1,
                    'line-opacity': 0.5,
                },
            },
                'studyspaces'
            );

            map.current!.addLayer({
                id: 'building-highlight',
                type: 'line',
                source: 'building-footprints',
                minzoom: 15,
                paint: {
                    'line-color': '#ff0000',
                    'line-width': 3,
                    'line-opacity': 0.8,
                },
                filter: ['==', 'name', ''],
            },
            'studyspaces'
            );

            map.current!.on('click', 'studyspaces', (e) => {
                const feature = e.features?.[0];
                if (feature && feature.properties?.name) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const buildingName = feature.properties.name;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    setSelectedBuilding(buildingName);
                
                    map.current!.setFilter('building-highlight', [
                    '==',
                    'name',
                    buildingName,
                    ]);
                } else {
                    setSelectedBuilding('Unknown Building');
                    map.current!.setFilter('building-highlight', ['==', 'name', '']);
                }
                });

            map.current!.on('click', 'building-outlines', (e) => {
                const feature = e.features?.[0];
                if (feature && feature.properties?.name) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const buildingName = feature.properties?.name ?? 'Unknown Building';
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    setSelectedBuilding(buildingName);
                    
                    map.current!.setFilter('building-highlight', [
                    '==',
                    'name',
                    buildingName,
                    ]);
                }
            });

            ['studyspaces', 'building-outlines'].forEach((layerId) => {
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
