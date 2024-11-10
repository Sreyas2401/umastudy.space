"use client";

import { useState } from 'react';
import * as React from 'react';


const ControlPanel = () => {

    const [buildingName, setBuildingName] = useState();
    
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
