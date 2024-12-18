import React, { useState } from 'react';
import './sidebar.css';

interface Selections {
    country: string;
    modelOutput: string;
    year: string;
    month: string; // Added month to the interface
    season: string;
}

interface SidebarProps {
    onSelectionSubmit: (selections: Selections, data: any) => void;
}

export default function Sidebar({ onSelectionSubmit }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [country, setCountry] = useState('');
    const [modelOutput, setModelOutput] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState(''); // Month state
    const [season, setSeason] = useState('');

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleSubmit = () => {
        const selections: Selections = { country, modelOutput, year, month, season }; // Included month in selections
        const data = null;
        onSelectionSubmit(selections, data);
    };

    // Determine year options and disable states based on model output
    const getYearOptions = () => {
        if (["NDVI_Trend", "NDVI_Rainfall_Correlation", "NDVI", "Precipitation", "TC_PPT_ANNUAL"].includes(modelOutput)) {
            return (
                <>
                    <option value="1983_2005">2005</option>
                    <option value="2006_2022">2022</option>
                </>
            );
        } else if (["Yield_Advantage_DK8053", "Yield_Advantage_PAN53", "Yield_Advantage_SC719", "Yield_Advantage_ZM309"].includes(modelOutput)) {
            return (
                <>
                    <option value="2005">2005</option>
                    <option value="2017">2017</option>
                </>
            );
        }
        return null;
    };

    const isYearDisabled = ["Cumulative_wet_days_Laos", "Cumulative_dry_days_Laos", "Rainfall_Cessation_Laos", "Rainfall_Onset_Laos", "Rainfall_Total_Mean_Laos", "r20_Laos", "Length_Growing_Period_Laos"].includes(modelOutput) ||
        ["TC_PPT_MAX", "TC_PPT_MIN", "TC_PPT"].includes(modelOutput);

    const isMonthDisabled = ["Cumulative_wet_days_Laos", "Cumulative_dry_days_Laos", "Rainfall_Cessation_Laos", "Rainfall_Onset_Laos", "Rainfall_Total_Mean_Laos", "r20_Laos", "Length_Growing_Period_Laos"].includes(modelOutput);

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                {isCollapsed ? 'Show' : 'Hide'}
            </button>
            {!isCollapsed && (
                <>
                    <h2>Selections</h2>
                    <label htmlFor="location">Select AOI</label>
                    <select
                        id="location"
                        name="location"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        <option value="" disabled hidden>
                            Select AOI
                        </option>
                        <option value="BURUNDI">Burundi</option>
                            <option value="GHANA">Ghana</option>
                            <option value="KENYA">Kenya</option>
                            <option value="Laos">Laos</option>
                            <option value="MALAWI">Malawi</option>
                            <option value="Mozambique">Mozambique</option>
                            <option value="RWANDA">Rwanda</option>
                            <option value="TANZANIA">Tanzania</option>
                            <option value="UGANDA">Uganda</option>
                            <option value="ZAMBIA">Zambia</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                    </select>

                    <label htmlFor="modelOutput">Select a Model Output:</label>
                    <select
                        id="modelOutput"
                        name="modelOutput"
                        value={modelOutput}
                        onChange={(e) => setModelOutput(e.target.value)}
                    >
                        <option value="" disabled hidden>
                            Select a Model Output
                        </option>
                        <option value="NDVI_Trend">NDVI_Trend</option>
                        <option value="NDVI_Rainfall_Correlation">NDVI_Rainfall_Corr</option>
                        <option value="NDVI">NDVI</option>
                        <option value="Precipitation">Precipitation</option>
                        <option value="TC_PPT_ANNUAL">TC_PPT_ANNUAL</option>
                        <option value="Yield_Advantage_DK8053">YA_DK8053</option>
                        <option value="Yield_Advantage_PAN53">YA_PAN53</option>
                        <option value="Yield_Advantage_SC719">YA_SC719</option>
                        <option value="Yield_Advantage_ZM309">YA_ZM309</option>
                        <option value="Cumulative_dry_days_Laos">Cumm_Wet_Days</option>
                        <option value="Cumulative_dry_days_Laos">Cumm_Dry_Days</option>
                        <option value="Rainfall_Cessation_Laos">Rainfall_Cessation</option>
                        <option value="Rainfall_Onset_Laos">Rainfall_Onset</option>
                        <option value="Rainfall_Total_Mean_Laos">Rainfall_Total_Mean</option>
                        <option value="r20_Laos">R20</option>
                        <option value="Length_Growing_Period_Laos">Growing Period</option>
                        <option value="TC_PPT_MAX">TC_PPT_MAX</option>
                        <option value="TC_PPT_MIN">TC_PPT_MIN</option>
                        <option value="TC_PPT">TC_PPT</option>
                        <option value="FARM_BOUNDARY">GHANA_BOUNDARY_DEL</option>
                    </select>

                    <label htmlFor="year">Select Year of Analysis:</label>
                    <select
                        id="year"
                        name="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        disabled={isYearDisabled}
                    >
                        <option value="" disabled hidden>
                            Select Year of Analysis
                        </option>
                        {getYearOptions()}
                    </select>

                    <label htmlFor="month">Select Month of Analysis:</label>
                    <select
                        id="month"
                        name="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        disabled={isMonthDisabled}
                    >
                        <option value="" disabled hidden>
                            Select Month of Analysis
                        </option>
                        <option value="JAN">January</option>
                        <option value="FEB">February</option>
                        <option value="MARCH">March</option>
                        <option value="APRIL">April</option>
                        <option value="MAY">May</option>
                        <option value="JUNE">June</option>
                        <option value="JULY">July</option>
                        <option value="AUG">August</option>
                        <option value="SEP">September</option>
                        <option value="OCT">October</option>
                        <option value="NOV">November</option>
                        <option value="DEC">December</option>
                    </select>

                    <button className="submit_request" onClick={handleSubmit}>
                        Submit Request
                    </button>
                </>
            )}
        </div>
    );
}




