import React, { useState } from 'react';
import './sidebar.css';

interface Selections {
    country: string;
    modelOutput: string;
    year: string;
    season: string;
}

interface SidebarProps {
    onSelectionSubmit: (selections: Selections, data: any) => void; // Update to accept both selections and data
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

    const handleSubmit = () => {
        const selections: Selections = { country, modelOutput, year, season };
        const data = null;
        onSelectionSubmit(selections, data);
    };
    const seasonOptions =
        country === 'cuvelai'
            ? ['MAIN'] 
            : ['WET', 'DRY'];

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                {isCollapsed ? 'Show' : 'Hide'}
            </button>
            {!isCollapsed && (
                <>
                    <h2>Selections</h2>
                    <label htmlFor="location">Select Country:</label>
                    <select 
                        id="location" 
                        name="location" 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)}
                        >
                        <option value="" disabled hidden>
                            Select a Country
                        </option>
                        <option value="MALAWI">Malawi</option>
                        <option value="BURUNDI">Burundi</option>
                        <option value="RWANDA">Rwanda</option>
                        <option value="ZAMBIA">Zambia</option>
                        <option value="TANZANIA">Tanzania</option>
                        <option value="KENYA">Kenya</option>
                        </select>

                    <label htmlFor="modelOutput">Select Model Output:</label>
                    <select 
                    id="modelOutput" 
                    name="modelOutput" 
                    value={modelOutput} 
                    onChange={(e) => setModelOutput(e.target.value)}
                    >
                    <option value="" disabled hidden>
                        Select a Product
                    </option>
                    <option value="NDVI_Rainfall_Correlation">Rainfall Corr</option>
                    <option value="NDVI">NDVI</option>
                    <option value="Precipitation">Precipitation</option>
                    </select>

                    <label htmlFor="year">Select Year:</label>
                    <select 
                        id="year" 
                        name="year" 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)}
                        >
                        <option value="" disabled hidden>
                            Select Year of Analysis
                        </option>
                        <option value="1983_2005">2005</option>
                        <option value="2006_2022">2022</option>
                        </select>

                    <button className="submit_request" onClick={handleSubmit}>Submit Request</button>
                </>
            )}
        </div>
    );
}

