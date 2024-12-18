

// // //second working code
"use client";
import React, { useState, useEffect } from 'react';
import './statscard.css';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { TooltipItem } from 'chart.js';
// import TooltipItem

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { KENYA, MALAWI, BURUNDI, RWANDA, ZAMBIA, TANZANIA, Zimbabwe, Laos } from './data';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

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
    const [isVisible, setIsVisible] = useState(false);
    const [barData, setBarData] = useState<any>(null);
    const [showRainfall, setShowRainfall] = useState(true); // Toggle between rainfall and temperature data
    const [chartData, setChartData] = useState<any>(null); // State to hold chart data
    const [isButtonVisible, setIsButtonVisible] = useState(true)
    useEffect(() => {
        console.log("Selections prop in Statscard:", selections);
    }, [selections]);

    const fetchWFSData = async () => {
        if (!selections.country) return;
    
        // Define the base URL
        let wfsRequestUrl = '';
    
        // Modify the URL based on modelOutput
        if (selections.modelOutput === 'TCP_ANNUAL' || selections.modelOutput === 'NDVI_trend' || selections.modelOutput === 'TC_PPT_MAX' || selections.modelOutput === 'TC_PPT_MIN' || selections.modelOutput === 'TC_PPT') {
            wfsRequestUrl = `http://5.252.54.37:8080/geoserver/Climate/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Climate%3ANDVI_Trend_stats.shp&maxFeatures=50&outputFormat=application%2Fjson`;
        }else if (selections.modelOutput === 'Cumulative_dry_days_Laos' || selections.modelOutput === 'Rainfall_Cessation_Laos' || selections.modelOutput === 'Rainfall_Onset_Laos' || selections.modelOutput === 'Rainfall_Total_Mean_Laos' || selections.modelOutput === 'r20_Laos' || selections.modelOutput === 'Length_Growing_Period_Laos') {
            wfsRequestUrl = `http://5.252.54.37:8080/geoserver/Climate/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Climate%3A${selections.modelOutput}.shp&maxFeatures=50&outputFormat=application%2Fjson`;
        }else if (selections.modelOutput === 'Yield_Advantage_DK8053' || selections.modelOutput === 'Yield_Advantage_PAN53' || selections.modelOutput === 'Yield_Advantage_SC719' || selections.modelOutput === 'Yield_Advantage_ZM309') {
            wfsRequestUrl = `http://5.252.54.37:8080/geoserver/Climate/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Climate%3A${selections.modelOutput}_${selections.year}.shp&maxFeatures=50&outputFormat=application%2Fjson`;
        } else {
            wfsRequestUrl = `http://5.252.54.37:8080/geoserver/Climate/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Climate%3A${selections.modelOutput}_${selections.year}_stats.shp&maxFeatures=50&outputFormat=application%2Fjson`;
        }
    
        console.log("wfsRequestUrl recreated", wfsRequestUrl);
    
        try {
            const response = await fetch(wfsRequestUrl);
            const geoJsonData: {
                features: { properties: { Low: number; Moderate: number; High: number } }[];
            } = await response.json();
    
            // Define land use properties and color mapping
            const landUseProperties: ("Low" | "Moderate" | "High")[] = ["Low", "Moderate", "High"];
            const colorMapping: { [key in "Low" | "Moderate" | "High"]: string } = {
                High: "#31bd4b",
                Moderate: "#dbcc3d",
                Low: "red"
            };
    
            // Initialize arrays to store values for each property
            const chartDataValues: { [key in "Low" | "Moderate" | "High"]: number[] } = {
                Low: [],
                Moderate: [],
                High: []
            };
    
            // Populate data arrays
            geoJsonData.features.forEach((feature) => {
                chartDataValues.Low.push(feature.properties.Low);
                chartDataValues.Moderate.push(feature.properties.Moderate);
                chartDataValues.High.push(feature.properties.High);
            });

            let countryNames = []; // Initialize countryNames as an empty string

            if (selections.country === 'Laos') {
                countryNames = ["Laos", "Malawi", "Rwanda", "Tanzania", "Zambia"];
            }else if (selections.modelOutput === 'Yield_Advantage_DK8053'  || selections.modelOutput === 'Yield_Advantage_PAN53'  || selections.modelOutput=== 'Yield_Advantage_SC719'  || selections.modelOutput=== 'Yield_Advantage_ZM309') {
                    countryNames = ["Malawi", "Mozambique","Zambia","Zimbabwe"];
                countryNames = ["Laos", "Malawi", "Rwanda", "Tanzania", "Zambia"]
            } else {
                countryNames = ["Burundi", "Malawi", "Rwanda", "Tanzania", "Zambia"];
            }
    
            // Create chart labels and datasets
            const chartLabels = countryNames.slice(0, geoJsonData.features.length);
            const datasets = landUseProperties.map(property => ({
                label: property,
                data: chartDataValues[property],
                backgroundColor: colorMapping[property],
                borderColor: colorMapping[property].replace('1.0', '1'),
                borderWidth: 1,
            }));
    
            const chartData2 = {
                labels: chartLabels,
                datasets: datasets
            };
    
            setBarData(chartData2);
    
        } catch (error) {
            console.error("Error fetching WFS data:", error);
        }
    };
    
    useEffect(() => {
    const fetchTrendData = async (country: string, year: string) => {
        let data;
        switch (country) {
            case 'MALAWI':
                data = MALAWI;
                break;
            case 'KENYA':
                data = KENYA;
                break;
            case 'Zimbabwe':
                data = Zimbabwe;
                break;
            case 'Laos':
                data = Laos;
                break;
            case 'TANZANIA':
                data = TANZANIA;
                break;
            case 'RWANDA':
                data = RWANDA;
                break;
            case 'BURUNDI':
                data = BURUNDI;
                break;
            case 'ZAMBIA':
                data = ZAMBIA;
                break;
            default:
                data = KENYA; // Default to KENYA if the country is not found
        }

        let result;
        if (year === "1983_2005" || "2006_2022" || "2006" || "2017" || "") {
            result = {
                Precipitation: data['Precipitation_2005'],
                Temperature: data['Temperature_2005']
            };
        } else if (year === "2005_2022") {
            result = {
                Precipitation: data['Precipitation_2005'],
                Temperature: data['Temperature_2005']
            };
        } else {
            return null; // Return null for invalid year
        }

        return result;
    };

    const selectedCountry = selections.country;
    const selectedYear = selections.year;

    // Fetch data and update state
    fetchTrendData(selectedCountry, selectedYear)
        .then((data) => {
            if (data) {
                const labels = Object.keys(data.Precipitation); // Assuming months are the same for both data sets
                const precipitationData = Object.values(data.Precipitation);
                const temperatureData = Object.values(data.Temperature);

                // Update chart data
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Precipitation',
                            data: precipitationData,
                            borderColor: 'blue',
                            backgroundColor: 'rgba(0, 0, 255, 0.2)',
                            fill: true,
                        },
                        {
                            label: 'Temperature',
                            data: temperatureData,
                            borderColor: 'red',
                            backgroundColor: 'rgba(255, 0, 0, 0.2)',
                            fill: true,
                        }
                    ]
                });
            } else {
                console.error('Invalid data for the selected year');
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}, [selections]); // Dependencies to trigger useEffect on changes in selections

const toggleTrendLine = () => {
    setShowRainfall(!showRainfall);
};


    let explanation = '';
        if (selections.modelOutput === 'NDVI_Rainfall_Correlation') {
            explanation = 'The map visually displays areas where vegetation is most influenced by precipitation. For example, regions where precipitation strongly impacts vegetation health.';
        } else if (selections.modelOutput === 'NDVI') {
            explanation = 'Normalized Vegetation Index (NDVI) is used to assess the health of vegetation, providing a measure of plant greenness and vitality.'
        } else if (selections.modelOutput === 'Precipitation') {
            explanation = 'This measure provides important information about the quantity of moisture that has been deposited on the land surface, which is critical for various environmental, agricultural, and hydrological processes.';
        } else if (selections.modelOutput === 'TC_PPT_ANNUAL' || selections.modelOutput === 'TC_PPT_MAX' || selections.modelOutput=== 'TC_PPT_MIN' || selections.modelOutput === 'TC_PPT' ) {
            explanation = 'The annual rainfall mean refers to the average amount of rainfall received over the course of a year in a specific area. It is typically measured in millimeters (mm) or inches and is calculated by adding the total amount of rainfall for each month (or each precipitation event) within a year and dividing that sum by 12 (for monthly data) or by the number of data points collected.';
        } else if (selections.modelOutput === 'NDVI_Trend') {
            explanation = 'Long-term NDVI (Normalized Difference Vegetation Index) trends provide valuable insights into vegetation health and changes in land cover over time. NDVI is a measure of vegetation greenness, which can indicate plant health, productivity, and biomass density.';
        } else if (selections.modelOutput === 'Yield_Advantage_DK8053'  || selections.modelOutput === 'Yield_Advantage_PAN53'  || selections.modelOutput=== 'Yield_Advantage_SC719'  || selections.modelOutput=== 'Yield_Advantage_ZM309' ) {
            explanation = 'Yield Advantage Analysis compares the productivity or yield of specific crop varieties under different conditions. It is often used in agriculture to assess how particular crop hybrids or varieties perform relative to others in terms of yield, given the same or varying environmental, soil, and climatic conditions'
        } else if (selections.modelOutput === 'Cumulative_dry_days_Laos') {
            explanation = 'The total number of consecutive days during a defined period (e.g., a season or year) with little to no rainfall. Typically, a day is considered dry if rainfall is below a certain threshold.';
        } else if (selections.modelOutput === 'Cumulative_wet_days_Laos') {
            explanation = 'Shows the total number of consecutive days during a defined period with significant rainfall. A day is typically considered wet if rainfall exceeds a threshold';
        } else if (selections.modelOutput === 'Rainfall_Cessation_Laos') {
            explanation = 'Rainfall Cessation refers to the point in time when the rainy season ends, marking a transition to drier conditions.';
        } else if (selections.modelOutput === 'Rainfall_Onset_Laos') {
            explanation = 'Rainfall Onset refers to the start of the rainy season when rainfall begins to exceed certain thresholds and provides sufficient water for agricultural activities and ecosystem sustainability';
        } else if (selections.modelOutput === 'Rainfall_Total_Mean_Laos') {
                explanation = 'Rainfall Total Mean refers to the average amount of rainfall recorded over a specific period (e.g., monthly, seasonally, or annually). This metric provides insights into rainfall distribution patterns, water availability, and climatic conditions in a region.';
        } else if (selections.modelOutput === 'r20_Laos') {
                explanation = 'R20 is a metric used in climatology and agriculture that measures the number of days within a given period where rainfall exceeds 20 mm. It is an important indicator for understanding the impact of heavy rainfall on crops, soil, and agricultural systems.';
        } else if (selections.modelOutput === 'Length_Growing_Period_Laos') {
                explanation = 'Length of Growing Period (LGP) is a key metric in agriculture and climatology that defines the period during which climatic and soil conditions are favorable for crop growth. It is critical for assessing agricultural productivity, selecting appropriate crops, and planning farming activities.';
        } else {
            explanation = 'This is a climate based dashboard, showcases climate datasets, please select a climate product of interest to get more insights, the insights are also inclusive of the charts tha will be shown here';
        }
    useEffect(() => {
        fetchWFSData();
    }, [selections]);
    

    const toggleVisibility = () => {
        setIsVisible((prev) => !prev);
    };
   
    const toggleButtonVisibility = () => {
        setIsButtonVisible((prev) => !prev);
    };

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    return (
        <>
            {isButtonVisible && (
                <button
                    className="hide_button"
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
                        zIndex: 11,
                    }}
                >
                    {isVisible ? 'Hide' : 'Show Stats'}
                </button>
            )}


            {isVisible && (
                <div className="statscard">
            <h2 className='stats_words'>Summary and Statistics</h2>
            <div className="piechart">
                <h3 style={{ marginLeft: '20px', lineHeight: '1.4', fontSize: '12px' }}>
                {explanation}
                </h3>
            </div>

            <div className="trendline">
                <h3 style={{ marginLeft: '20px', lineHeight: '1.4', fontSize: '14px' }}>
                    {showRainfall ?'':''}
                </h3>

                <button
                    onClick={toggleTrendLine}
                    style={{
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        borderRadius: '5px',
                        cursor: 'pointer'
                        
                    }}
                >
                    Toggle
                </button>

                {chartData && (
                    <Line
                        // data={{
                        //     labels: chartData.labels,
                        //     datasets: showRainfall ? [chartData.datasets[0]] : [chartData.datasets[1]],
                        // }}
                        data={{
                            labels: months,  // Use the months array as labels
                            datasets: showRainfall 
                                ? [chartData.datasets[0]] 
                                : [chartData.datasets[1]],
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: false,
                
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (tooltipItem) {
                                            return `${tooltipItem.dataset.label}: ${(tooltipItem.raw as number).toFixed(2)}`;
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Months'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Amount(mm)'
                                    },
                                    beginAtZero: true,
                                }
                            }
                        }}
                    />
                )}
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

