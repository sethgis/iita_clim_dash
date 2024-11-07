import React, { useEffect } from 'react';
import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';

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

interface MapComponentProps {
    selections: Selections;
    data: Data | null; // Allow data to be null
}

const defaultMapContainerStyle = {
    width: '100%',
    height: '93.5vh',
};

const leafletOptions = {
    center: [23.36460, 5.9757] as [number, number],
    zoom: 4,
};

const MapComponent: React.FC<MapComponentProps> = ({ selections }) => {
    useEffect(() => {
        console.log("Selections prop:", selections);
    }, [selections]);

    const { country, modelOutput, year, season } = selections;

    // Check for valid selections before constructing the URL
    // if (!modelOutput || !season || !year) {
    //     return <div>Please select model output, season, and year.</div>;
    // }

    const WMS_URL = `http://66.42.65.87:8080/geoserver/LANDSAT_${modelOutput}_${season}/wms`;
    // const WMS_URL = `http://66.42.65.87:8080/geoserver/LANDSAT_NDVI_DRY/wms`;
    // const product = `LANDSAT_${modelOutput}_${season}:${year}`;
    const product = `LANDSAT_NDVI_DRY:2000`;
    console.log("PRODUCT",product)

    return (
        <div className="map-container" style={defaultMapContainerStyle}>
            <MapContainer
                center={leafletOptions.center}
                zoom={leafletOptions.zoom}
                style={defaultMapContainerStyle}
            >
                <TileLayer
                    url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=XJN0Iz2XNa6bkwwZTp1F`}
                    tileSize={512}
                    zoomOffset={-1}
                    minZoom={1}
                    attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
                    crossOrigin={true}
                />
                <WMSTileLayer
                    url={WMS_URL}
                    params={{
                        service: "WMS",
                        request: "GetMap",
                        layers: product,
                        format: "image/png",
                        styles: country,
                        transparent: true,
                        version: "1.1.0",
                    }}
                    opacity={1.0}
                />
            </MapContainer>
        </div>
    );
};

export default MapComponent;


// import React, { useEffect } from 'react';
// import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import './map.css';

// interface Selections {
//     country: string;
//     modelOutput: string;
//     year: string;
//     season: string;
// }

// interface Data {
//     wfsData: any; // Replace `any` with a more specific type if available
//     wmsUrl: string;
// }

// interface MapComponentProps {
//     selections: Selections;
//     data: Data | null; // Allow data to be null
// }

// const defaultMapContainerStyle = {
//     width: '100%',
//     height: '93.5vh',
// };

// // Leaflet map options
// const leafletOptions = {
//     center: [23.36460, 5.9757] as [number, number],
//     zoom: 4,
// };

// const MapComponent: React.FC<MapComponentProps> = ({ selections }) => {
//     useEffect(() => {
//         console.log("Selections prop:", selections);
//         // console.log("Data prop:", data); 
//     }, [selections])

//     // Handle loading state if data is missing
//     // if (!data) {
//     //     return <div>Loading map...</div>; // Optional loading state or placeholder
//     // }

//     const { country, modelOutput, year, season } = selections;

//     const WMS_URL = `http://66.42.65.87:8080/geoserver/LANDSAT_${modelOutput}_${season}/wms`;
//     const product = `LANDSAT_${modelOutput}_${season}:${year}`;

//     return (
//         <div className="map-container" style={defaultMapContainerStyle}>
//             <MapContainer
//                 center={leafletOptions.center}
//                 zoom={leafletOptions.zoom}
//                 style={defaultMapContainerStyle}
//             >
//                 <TileLayer
//                     url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=XJN0Iz2XNa6bkwwZTp1F`}
//                     tileSize={512}
//                     zoomOffset={-1}
//                     minZoom={1}
//                     attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
//                     crossOrigin={true}
//                 />
//                 <WMSTileLayer
//                     url={WMS_URL}
//                     params={{
//                         service: "WMS",
//                         request: "GetMap",
//                         layers: product,
//                         format: "image/png",
//                         styles: country,
//                         transparent: true,
//                         version: "1.1.0",
//                     }}
//                     opacity={1.0}
//                 />
//             </MapContainer>
//         </div>
//     );
// };

// export default MapComponent;

