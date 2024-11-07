"use client";
import Sidebar from "./sidebar";
import MapProvider from "./map-providers";
import Statscard from "./statscard";
import { useState } from "react";
import dynamic from 'next/dynamic';
import './leaflet.css';

// Dynamically import MapComponent with ssr: false
const MapComponent = dynamic(() => import('./leaflet'), { 
  ssr: false
});

interface Selections {
    country: string;
    modelOutput: string;
    year: string;
    season: string;
}

interface Data {
    wfsData: any;  // Replace `any` with a more specific type if available
    wmsUrl: string;
}

export default function Dashboard() {
    // Define the initial values
    const defaultSelections: Selections = {
        country: '',
        modelOutput: '',
        year: '',
        season: '',
    };

    const defaultData: Data = {
        wfsData: null, // You can set a more specific type here
        wmsUrl: '',
    };

    // Define the state for selections and data
    const [mapSelections, setMapSelections] = useState<Selections>(defaultSelections);
    const [mapData, setMapData] = useState<Data>(defaultData);

    // Define the function to handle selections
    const handleSelectionSubmit = (selections: Selections, data: Data) => {
        console.log("Selection by a user:", selections);
        console.log("WMS & WFS Dictionary:", data);
        setMapSelections(selections);
        setMapData(data);
    };

    return (
        <div>
            <MapProvider>
                <MapComponent selections={mapSelections} data={mapData} />
            </MapProvider> 
            <Sidebar onSelectionSubmit={handleSelectionSubmit} />
            <Statscard />
        </div>
    );
}

