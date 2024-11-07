"use client"; 
import React, { useState } from 'react';
import './statscard.css';

export default function Statscard() {
    const [isVisible, setIsVisible] = useState(true);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <>
            <button className='hide_button'
                onClick={toggleVisibility} 
                style={{
                    position: 'fixed',
                    top: '15%', 
                    right: isVisible ? '30%' : '2%',
                    transform: 'translateX(50%)',
                    padding: '0.5vh 1vh',
                    borderRadius: '5px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: '#6b6767',
                    color: 'white',
                    fontSize: '1em',
                    zIndex: 11
                }}
            >
                {isVisible ? 'Hide':'Show'}
            </button>
            
            {isVisible && (
                <div className="statscard">
                    <h2 className='stats_words'>Summary and Statistics</h2> 
                    <div className="piechart"><h3>Deforestation Index</h3></div> 
                    <div className="trendline"><h3>Linear Trend from 2020</h3></div>
                    <div className="trendline2"><h3>Linear Trend from 2020</h3></div>
                </div>
            )}
        </>
    );
}



