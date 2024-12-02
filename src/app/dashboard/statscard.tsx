

// // //second working code
"use client";
import React, { useState, useEffect } from 'react';
import './statscard.css';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
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

import { KENYA, MALAWI, BURUNDI, RWANDA, ZAMBIA, TANZANIA } from './data';
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
    const [isVisible, setIsVisible] = useState(true);
    const [barData, setBarData] = useState<any>(null);
    const [showRainfall, setShowRainfall] = useState(true); // Toggle between rainfall and temperature data
    const [chartData, setChartData] = useState<any>(null); // State to hold chart data
    const [isButtonVisible, setIsButtonVisible] = useState(true)
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

            const chartData2 = {
                labels: chartLabels,
                datasets: [{
                    label: `Stats for ${selections.country}`,
                    data: chartDataValues,
                    backgroundColor: chartBackgroundColors,
                    borderColor: chartBackgroundColors.map(color => color.replace('0.2', '1')),
                    borderWidth: 1,
                }],
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
            if (year === "1983_2005") {
                result = {
                    Precipitation: data['Precipitation_2005'],
                    Temperature: data['Temperature_2005']
                };
            } else if (year === "2005_2022") {
                result = {
                    Precipitation: data['Precipitation_2022'],
                    Temperature: data['Temperature_2022']
                };
            } else {
                return ;
            }

            return result;
        };

        const selectedCountry = selections.country 
        const selectedYear = selections.year 

        fetchTrendData(selectedCountry, selectedYear)
            .then(data => {
                if (data) {
                    const labels = Object.keys(data.Precipitation); // Assuming months are the same for both data sets
                    const precipitationData = Object.values(data.Precipitation);
                    const temperatureData = Object.values(data.Temperature);

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
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [selections]);

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
    
        } else {
            explanation = 'This is a climate based dashboard, showcases calimate datasets, please select a climate product of interest to get more information';
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
                    {isVisible ? 'Hide' : 'Show'}
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
                    {showRainfall ? 'Rainfall Trend Line' : 'Temperature Trend Line'}
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
                        data={{
                            labels: chartData.labels,
                            datasets: showRainfall ? [chartData.datasets[0]] : [chartData.datasets[1]],
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
                                            return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(2)}`;
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

