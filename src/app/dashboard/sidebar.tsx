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
        const data = null; // You can set this to whatever data you need

        // Pass selections and fetched data to the parent component
        onSelectionSubmit(selections, data);
    };

    // Conditional logic for available season options
    const seasonOptions =
        country === 'cuvelai'
            ? ['MAIN'] // Only MAIN for cuvelai
            : ['WET', 'DRY']; // WET and DRY for other countries

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
                        <option value="Cuvelai">cuvelai</option>
                        <option value="Limpopo">limpopo</option>
                        <option value="Okavango">okavango</option>
                        <option value="Zambezi">zambezi</option>
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

                    {/* Conditionally render season dropdown */}
                    {modelOutput !== 'LULC' && (
                        <>
                            <label htmlFor="season">Select Season:</label>
                            <select id="season" name="season" value={season} onChange={(e) => setSeason(e.target.value)}>
                                {seasonOptions.map((seasonOption) => (
                                    <option key={seasonOption} value={seasonOption}>
                                        {seasonOption}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    <button className="submit_request" onClick={handleSubmit}>Submit Request</button>
                </>
            )}
        </div>
    );
}

