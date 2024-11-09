"use client";

import * as React from 'react';

interface ControlPanelProps {
    onResetView: () => void; // Function type: no arguments, no return value
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',  // Slightly opaque background for contrast
            padding: '20px', 
            borderRadius: '8px', 
            width: '250px', // Fixed width for control box
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds shadow to the box
        }}
        >
        <hr />
        {/* Placeholder for search bar */}
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
