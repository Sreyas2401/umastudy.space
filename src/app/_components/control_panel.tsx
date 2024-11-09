"use client";

import * as React from 'react';

interface ControlPanelProps {
    onResetView: () => void; 
  }

const ControlPanel = ({onResetView }: ControlPanelProps) => {
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
        <button 
                onClick={onResetView} 
                style={{
                    top: '20px', 
                    left: '20px', 
                    padding: '10px 20px', 
                    backgroundColor: '#007BFF', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer'
                }}
            >
                Go to Campus
        </button>
        </div>
    );
    }

export default React.memo(ControlPanel);
