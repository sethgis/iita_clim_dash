
import React, { useState } from 'react';
import Sidebar from './sidebar'; // Adjust the import path as needed
import MapComponent from './leaflet'; // Adjust the import path as needed

// Define the Selections type
interface Selections {
    country: string;
    modelOutput: string;
    year: string;
    season: string;
}

// Define the Data type
interface Data {
    wfsData: any; // Replace `any` with a more specific type if available
    wmsUrl: string;
}

const App = () => {
    const [selections, setSelections] = useState<Selections>({
        country: '',
        modelOutput: '',
        year: '',
        season: ''
    });
    const [data, setData] = useState<Data | null>(null); // Allow data to be null

    const handleSelectionSubmit = (newSelections: Selections, fetchedData: Data | null) => {
        setSelections(newSelections);
        setData(fetchedData);
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar onSelectionSubmit={handleSelectionSubmit} />
            <MapComponent selections={selections} data={data} />
        </div>
    );
};

export default App;


