"use client";

import { useState, useEffect } from 'react';
import * as React from 'react';
import { BLDG_IDS, BLDG_PARTS, REVERSED_BLDG_NAMES } from '../utils/buildingMap';

interface ControlPanelProps {
    onSelectBuilding: (buildingId: string) => void;
    onDeselectBuilding: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
    onSelectBuilding, 
    onDeselectBuilding 
}) => {

    useEffect(() => {
        console.log(inputText);
        onDeselectBuilding();
        const abbr = REVERSED_BLDG_NAMES[inputText]!;
        const id = BLDG_IDS[abbr];
        if(id) id.forEach(i => onSelectBuilding(i));
        return;
    })

    const [inputText, setInputText] = useState("");

    const inputHandler = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputText(e.target.value);
    }
    
    return (
        <div 
        className="control-panel" 
        style={{
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            zIndex: 10, 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',  
            padding: '20px', 
            borderRadius: '8px', 
            width: '250px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
        >
        <hr />
        <input
            type="text"
            placeholder="Search Buildings"
            onChange={inputHandler}
            style={{
            width: '100%', 
            padding: '10px', 
            borderRadius: '5px', 
            border: '1px solid #ddd', 
            marginBottom: '10px'
            }}
        />
        
        </div>
    );
    }

export default React.memo(ControlPanel);
