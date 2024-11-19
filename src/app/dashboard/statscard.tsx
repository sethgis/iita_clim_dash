"use client";
import React, { useState, useEffect } from 'react';
import './statscard.css';
import { Doughnut } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register chart elements with Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Selections {
    country: string;
    modelOutput: string;
    year: string;
    season: string;
}

interface Data {
    wfsData: any;
    wmsUrl: string;
}

interface StatscardProps {
    selections: Selections;
    data: Data | null;
}

export default function Statscard({ selections }: StatscardProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [barData, setBarData] = useState<any>(null);
    const [showRainfall, setShowRainfall] = useState(true); // State to toggle between rainfall and temperature

    useEffect(() => {
        console.log("Selections prop in Statscard:", selections);
    }, [selections]);

    const fetchWFSData = async () => {
        if (!selections.country) return;

        const wfsRequestUrl = `http://66.42.65.87:8080/geoserver/LULC_2_STATS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=LULC_2_STATS%3A2017.shp&maxFeatures=50&outputFormat=application%2Fjson`;

        try {
            const response = await fetch(wfsRequestUrl);
            const geoJsonData = await response.json();
            const filteredData = geoJsonData.features[0].properties;

            const landUseProperties = [
                "Agricultur", "Forest", "Grassland", "Wetland", "Builtup",
                "Shrubland", "Bareland", "Water"
            ];

            const colorMapping: { [key: string]: string } = {
                "Agricultur": "rgba(34, 139, 34, 1.0)",
                "Forest": "rgba(0, 128, 0, 1.0)",
                "Grassland": "rgba(154, 205, 50, 1.0)",
                "Wetland": "rgba(0, 191, 255, 1.0)",
                "Builtup": "rgba(255, 69, 0, 1.0)",
                "Shrubland": "rgba(160, 82, 45, 1.0)",
                "Bareland": "rgba(255, 255, 0, 1.0)",
                "Water": "rgba(30, 144, 255, 1.0)"
            };

            const chartLabels = landUseProperties.filter(key => key in filteredData);
            const chartDataValues = chartLabels.map(key => filteredData[key]);
            const chartBackgroundColors = chartLabels.map(label => colorMapping[label] || 'rgba(0, 0, 0, 0.2)');

            const chartData = {
                labels: chartLabels,
                datasets: [{
                    label: `Stats for ${selections.country}`,
                    data: chartDataValues,
                    backgroundColor: chartBackgroundColors,
                    borderColor: chartBackgroundColors.map(color => color.replace('0.2', '1')),
                    borderWidth: 1,
                }],
            };

            setBarData(chartData);

        } catch (error) {
            console.error("Error fetching WFS data:", error);
        }
    };
    let explanation = '';
        if (selections.modelOutput === 'LULC') {
            explanation = 'Land Use and Land Cover (LULC) analysis focuses on monitoring changes in the use and cover of land over time, providing valuable insights for environmental planning and management.';
        } else if (selections.modelOutput === 'NDVI') {
            explanation = 'Normalized Vegetation Index (NVI) is used to assess the health of vegetation, providing a measure of plant greenness and vitality.'
        } else if (selections.modelOutput === 'TC_PPT_ANNUAL') {
            explanation = 'Climate Hazards Center InfraRed Precipitation with Station data (CHIRPS) is a 30+ year quasi-global rainfall dataset. CHIRPS incorporates 0.05° resolution satellite imagery with in-situ station data to create gridded rainfall time series for trend analysis and seasonal drought monitoring.';
        } else {
            explanation = 'Select a model to view the summary explanation.';
        }

    

    useEffect(() => {
        fetchWFSData();
    }, [selections]);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const toggleTrendLine = () => {
        setShowRainfall(!showRainfall);
    };

    return (
        <>
            <button 
                className='hide_button'
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
                {isVisible ? 'Hide' : 'Show'}
            </button>

            {isVisible && (
                <div className="statscard">
                    <h2 className='stats_words'>Summary and Statistics</h2> 
                    <div className="piechart">
                        <h3 style={{ marginLeft: '20px', lineHeight: '1.4', fontSize: '14px' }}>
                        {explanation}
                        </h3>
                    </div> 

                    <div className="trendline">
                        <h3 style={{ marginLeft: '20px', lineHeight: '1.4', fontSize: '14px' }}>
                            {showRainfall ? 'Rainfall Trend Line from 2020' : 'Temperature Trend Line from 2020'}
                        </h3>
                        <button
                            onClick={toggleTrendLine}
                            style={{
                                padding: '0.5vh 1vh',
                                borderRadius: '5px',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: '#007bff',
                                color: 'white',
                                fontSize: '0.9em',
                                marginLeft: '20px',
                                marginTop: '10px'
                            }}
                        >
                            {showRainfall ? 'Show Temperature Trend Line' : 'Show Rainfall Trend Line'}
                        </button>
                    </div>

                    <div className="trendline2">
                        <h3 style={{ marginLeft: '20px', lineHeight: '1.4', fontSize: '14px' }}>
                        </h3>
                        {barData && <Bar data={barData} />}
                    </div>
                </div>
            )}
        </>
    );
}
