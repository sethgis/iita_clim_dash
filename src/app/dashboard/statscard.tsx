"use client"; 
import React, { useState, useEffect } from 'react';
import './statscard.css';
import { Doughnut } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';

// import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart elements with Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Selections {
    country: string;
    modelOutput: string;
    year: string;
    season: string;
}

interface Data {
    wfsData: any; // Replace `any` with a more specific type if available
    wmsUrl: string;
}

interface StatscardProps {
    selections: Selections;
    data: Data | null; // Allow data to be null
}

export default function Statscard({ selections }: StatscardProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [barData, setBarData] = useState<any>(null); // State for bar graph data

    // Effect to log selections prop or perform other side effects
    useEffect(() => {
        console.log("Selections prop in Statscard:", selections);
    }, [selections]); // The effect runs whenever 'selections' prop changes

    // Function to fetch WFS data based on the selected country
    const fetchWFSData = async () => {
        if (!selections.country) return; // If country is not selected, don't fetch

        const wfsUrl = ""; // Assuming your WMS URL is in `data?.wmsUrl`
        const wfsRequestUrl = `http://66.42.65.87:8080/geoserver/LULC_2_STATS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=LULC_2_STATS%3A2017.shp&maxFeatures=50&outputFormat=application%2Fjson`;

        try {
            const response = await fetch(wfsRequestUrl);
            const geoJsonData = await response.json();

            // Filter the geoJSON data based on country selection and calculate stats
            // const filteredData = geoJsonData.features.filter((feature: any) => feature.properties.country === selections.country);
            const filteredData = geoJsonData.features.filter((feature: any) => feature.properties.country === selections.country);
            console.log("Filtered_stats_data",filteredData)

            // Example: Assume the stats you need are in `property.value` and calculate something (e.g., sum)
            const stats = filteredData.map((feature: any) => feature.properties.value);
            const totalStats = stats.reduce((acc: number, val: number) => acc + val, 0);
            console.log("Filtered stats:", totalStats);

            // Prepare data for the bar chart
            const chartData = {
                labels: filteredData.map((feature: any) => feature.properties.name), // e.g., feature names (e.g., regions, years)
                datasets: [{
                    label: 'Stats for ' + selections.country,
                    data: stats,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }],
            };

            setBarData(chartData); // Update the bar graph data
        } catch (error) {
            console.error("Error fetching WFS data:", error);
        }
    };

    // Fetch WFS data when the selections change
    useEffect(() => {
        fetchWFSData();
    }, [selections]); // Trigger fetch when `selections` changes

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    // Conditional explanation content based on modelOutput
    let explanation = '';
    if (selections.modelOutput === 'LULC') {
        explanation = 'Land Use and Land Cover (LULC) analysis focuses on monitoring changes in the use and cover of land over time, providing valuable insights for environmental planning and management.';
    } else if (selections.modelOutput === 'NDVI') {
        explanation = 'Normalized Vegetation Index (NVI) is used to assess the health of vegetation, providing a measure of plant greenness and vitality.';
    } else {
        explanation = 'Select a model to view the summary explanation.';
    }

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
                    <div className="piechart"><h3>{explanation}</h3></div> 
                    <div className="trendline"><h3>Rainfall Trend Line from 2020</h3></div>
                    <div className="trendline2">
                        <h3>Bar Graph from 2020 Analytics</h3>
                        {barData && <Bar data={barData} />}
                    </div>
                </div>
            )}
        </>
    );
}



