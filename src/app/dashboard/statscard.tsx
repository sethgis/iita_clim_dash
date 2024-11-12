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
            console.log("raw geojson data",geoJsonData)


            const filteredData = geoJsonData.features[0].properties;
            console.log("One Features:", filteredData);

            const landUseProperties = [
                "Agricultur", "Forest", "Grassland", "Wetland", "Builtup",
                "Shrubland", "Bareland", "Water"
            ];

            const colorMapping: { [key: string]: string } = {
                "Agricultur": "rgba(34, 139, 34, 0.2)",  // Green
                "Forest": "rgba(0, 128, 0, 0.2)",       // Dark Green
                "Grassland": "rgba(154, 205, 50, 0.2)", // Yellow-Green
                "Wetland": "rgba(0, 191, 255, 0.2)",     // Light Blue
                "Builtup": "rgba(255, 69, 0, 0.2)",      // Red
                "Shrubland": "rgba(160, 82, 45, 0.2)",   // Brown
                "Bareland": "rgba(255, 255, 0, 0.2)",    // Yellow
                "Water": "rgba(30, 144, 255, 0.2)"       // Dodger Blue
            };
    
            // Filter the properties to include only those from Agricultur onward
            const chartLabels = landUseProperties.filter(key => key in filteredData);
            const chartDataValues = chartLabels.map(key => filteredData[key]);

            const chartBackgroundColors = chartLabels.map(label => colorMapping[label] || 'rgba(0, 0, 0, 0.2)');  // Default to black if no color found
    
            console.log("Chart Labels:", chartLabels);
            console.log("Chart Data Values:", chartDataValues);
    
            // Prepare data for the bar chart
            const chartData = {
                labels: chartLabels,  // Labels for the land use types
                datasets: [{
                    label: `Stats for ${selections.country}`,
                    data: chartDataValues,
                    backgroundColor: chartBackgroundColors,
                    borderColor: chartBackgroundColors.map(color => color.replace('0.2', '1')),
                    borderWidth: 1,
                }],
            };
    
            console.log("Chart Data:", chartData);
    
            // Assuming you are using a state hook to store the chart data
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
    
    // // In JSX, apply inline styles
    // return (
    //     <div style={{ marginLeft: '20px', lineHeight: '1.4', fontSize: '14px' }}>
    //         {explanation}
    //     </div>
    // );

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
                    <div className="piechart" ><h3 style={{ marginLeft: '20px', lineHeight: '1.4', fontSize: '14px' }}>{explanation}</h3></div> 
                    <div className="trendline"><h3 style={{ marginLeft: '20px', lineHeight: '1.4', fontSize: '14px' }}>Rainfall Trend Line from 2020</h3></div>
                    <div className="trendline2">
                        <h3 style={{ marginLeft: '20px', lineHeight: '1.4', fontSize: '14px' }}>Bar Graph for Analytics</h3>
                        {barData && <Bar data={barData} />}
                    </div>
                </div>
            )}
        </>
    );
}



