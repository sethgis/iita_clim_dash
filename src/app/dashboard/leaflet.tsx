import React, { useEffect } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { CRS } from 'leaflet';

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

    // let WMS_URL = '';
    // let product = '';

    const { country, modelOutput, year, season } = selections;

    // Set default WMS URL and product
    let WMS_URL = `http://66.42.65.87:8080/geoserver/${modelOutput}/wms?`;
    let product = `${modelOutput}:${year}`;
    let style = ``;


    // Adjust WMS URL and product if modelOutput is 'NDVI'
    if (modelOutput === 'NDVI') {
        WMS_URL = `http://66.42.65.87:8080/geoserver/LANDSAT_${modelOutput}_${season}/wms?`;
        product = `LANDSAT_NDVI_${season}:${year}`;
        console.log("PRODUCT:", product);
        console.log("WMS URL:", WMS_URL);
    } else if (modelOutput === 'LULC') {
        console.log("PRODUCT:", product);
        console.log("WMS URL:", WMS_URL);
    }

    return (
        <div className="map-container" style={defaultMapContainerStyle}>
            <MapContainer
                center={leafletOptions.center}
                zoom={leafletOptions.zoom}
                style={defaultMapContainerStyle}
                crs={CRS.EPSG3857}
            >
                <LayersControl position="topright">
                    {/* Streets Base Layer */}
                    <LayersControl.BaseLayer checked name="Streets">
                        <TileLayer
                            url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=XJN0Iz2XNa6bkwwZTp1F"
                            tileSize={512}
                            zoomOffset={-1}
                            minZoom={1}
                            attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
                            crossOrigin={true}
                        />
                    </LayersControl.BaseLayer>

                    {/* Satellite Base Layer */}
                    <LayersControl.BaseLayer name="Satellite">
                        <TileLayer
                            url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=XJN0Iz2XNa6bkwwZTp1F"
                            tileSize={512}
                            zoomOffset={-1}
                            minZoom={1}
                            attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
                            crossOrigin={true}
                        />
                    </LayersControl.BaseLayer>

                    {/* Topographic Base Layer */}
                    <LayersControl.BaseLayer name="Topographic">
                        <TileLayer
                            url="https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=XJN0Iz2XNa6bkwwZTp1F"
                            tileSize={512}
                            zoomOffset={-1}
                            minZoom={1}
                            attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
                            crossOrigin={true}
                        />
                    </LayersControl.BaseLayer>

                    {/* WMS Layer */}
                    <LayersControl.Overlay checked name="WMS Layer">
                        <WMSTileLayer
                            url={WMS_URL}
                            params={{
                                service: "WMS",
                                request: "GetMap",
                                layers: product,
                                format: "image/png",
                                styles: style,
                                transparent: true,
                                version: "1.1.0",
                            }}
                            opacity={1.0}
                            crossOrigin="anonymous"
                        />
                    </LayersControl.Overlay>
                </LayersControl>
            </MapContainer>
        </div>
    );
};

export default MapComponent;
