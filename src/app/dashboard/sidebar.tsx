import React, { useState } from 'react';
import './sidebar.css';

interface Selections {
    country: string;
    modelOutput: string;
    year: string;
    season: string;
}

interface SidebarProps {
    onSelectionSubmit: (selections: Selections, data: any) => void; // Update type for data as needed
}

export default function Sidebar({ onSelectionSubmit }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [country, setCountry] = useState('');
    const [modelOutput, setModelOutput] = useState('');
    const [year, setYear] = useState('');
    const [season, setSeason] = useState('');

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const fetchWFSData = async () => {
        try {
            const wfsUrl = `http://66.42.65.87:8080/geoserver/${modelOutput}_2_STATS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${modelOutput}_2_STATS%3A${year}.shp&maxFeatures=50&outputFormat=application%2Fjson`;
            const wmsUrl = `http://66.42.65.87:8080/geoserver/${modelOutput}/wms?service=WMS&version=1.1.0&request=GetMap&layers=${modelOutput}%3A${year}&bbox=13.875377878611111%2C-26.520063817777775%2C36.4787870575%2C-8.962491589722221&width=768&height=596&srs=EPSG%3A4326&styles=&format=image%2Fpng`;

            const wfsResponse = await fetch(wfsUrl);
            if (!wfsResponse.ok) throw new Error('Network response was not ok for WFS');
            const wfsData = await wfsResponse.json();

            return { wfsData, wmsUrl };
        } catch (error) {
            console.error('Error fetching WFS or WMS data:', error);
            return null;
        }
    };

    const handleSubmit = async () => {
        const selections = { country, modelOutput, year, season };
        const data = await fetchWFSData();

        // Pass selections and fetched data to the parent component
        onSelectionSubmit(selections, data);
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                {isCollapsed ? 'Show' : 'Hide'}
            </button>
            {!isCollapsed && (
                <>
                    <h2>Selections</h2>
                    <label htmlFor="location">Select Country:</label>
                    <select id="location" name="location" value={country} onChange={(e) => setCountry(e.target.value)}>
                        <option value="Uganda">Uganda</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Malawi">Malawi</option>
                        <option value="South_sudan">South Sudan</option>
                    </select>

                    <label htmlFor="modelOutput">Select Model Output:</label>
                    <select id="modelOutput" name="modelOutput" value={modelOutput} onChange={(e) => setModelOutput(e.target.value)}>
                        <option value="NDVI">NDVI</option>
                        <option value="LULC">LULC</option>
                        <option value="SPI">SPI</option>
                        <option value="SPEI">SPEI</option>
                    </select>

                    <label htmlFor="year">Select Year:</label>
                    <select id="year" name="year" value={year} onChange={(e) => setYear(e.target.value)}>
                        <option value="2019">2019</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>

                    <label htmlFor="season">Select Season:</label>
                    <select id="season" name="season" value={season} onChange={(e) => setSeason(e.target.value)}>
                        <option value="Season_A">Season_A</option>
                        <option value="Season_B">Season_B</option>
                        <option value="Single_Season">Main_Season</option>
                    </select>
                    
                    <button className="submit_request" onClick={handleSubmit}>Submit Request</button>
                </>
            )}
        </div>
    );
}
