
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, LayersControl, ImageOverlay, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { CRS, LatLngBoundsExpression, LatLngBounds } from 'leaflet';

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
    center: [2.5, 30], // Approximate center of East Africa (you can adjust the lat/lng as needed)
    zoom: 18, // Adjust zoom level as per East Africa zoom level preference
};

// Custom hook to fit the bounds when they change
const FitBoundsToSelection = ({ bounds }: { bounds: LatLngBoundsExpression | null }) => {
    const map = useMap();

    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds); // This will zoom and pan the map to the bounds
        }
    }, [bounds, map]);

    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ selections }) => {
    const [wmsImageUrl, setWmsImageUrl] = useState<string | null>(null);
    const [legendUrl, setLegendUrl] = useState<string | null>(null); // State for legend URL
    const [bounds, setBounds] = useState<LatLngBoundsExpression | null>(null);

    const { country, modelOutput, year, season } = selections;

    // Set default WMS URL and product
    let WMS_URL = `http://66.42.65.87:8080/geoserver/${modelOutput}/wms`;
    let product = '';
    let product_legend = '';
    let style = '';
    let bbox = '';

    if (modelOutput === 'NDVI') { 
        WMS_URL = `http://66.42.65.87:8080/geoserver/LANDSAT_${modelOutput}_${season}/wms`;
        product = `LANDSAT_NDVI_${season}:${year}`;
        bbox = '13.875377878611111,-26.520063817777775,36.4787870575,-8.962491589722221';
    } else if (modelOutput === 'LULC') {
        product = `${modelOutput}:${year}`;
        product_legend = 'LULC:1995';
        bbox = '13.875377878611111,-26.520063817777775,36.4787870575,-8.962491589722221';
    } else if (modelOutput === 'TC_PPT_ANNUAL') {
        WMS_URL = `http://66.42.65.87:8080/geoserver/LULC_2/wms?`;
        product = `LULC_2:${modelOutput}`;
        product_legend = 'BURUNDI_TC_PPT_ANNUAL';
        style = `${country}_TC_PPT_ANNUAL`;
        bbox = '21.9948,-18.086400000000005,41.9274,5.0571';
    }

    const lowerCaseModelOutput = modelOutput.toLowerCase();
    
    if (country === 'limpopo') {
        style = `limpopo_${lowerCaseModelOutput}`;
    } else if (country === 'cuvelai') {
        style = `cuvelai_${lowerCaseModelOutput}`;
    } else if (country === 'okavango') {
        style = `okavango_${lowerCaseModelOutput}`;
    } else if (country === 'zambezi') {
        style = `zambezi_${lowerCaseModelOutput}`;
    } else {
        console.error('Invalid country selection');
    }

    // Fetch the WMS image and legend, and dynamically set bounds
    useEffect(() => {
        const fetchWMSImageAndLegend = async () => {
            const mapParams = new URLSearchParams({
                service: 'WMS',
                request: 'GetMap',
                styles: style,
                layers: product,
                format: 'image/png',
                transparent: 'true',
                version: '1.1.0',
                bbox: bbox,
                width: '768',
                height: '596',
                srs: 'EPSG:4326',
            });

            const legendParams = new URLSearchParams({
                REQUEST: 'GetLegendGraphic',
                VERSION: '1.0.0',
                FORMAT: 'image/png',
                WIDTH: '20',
                HEIGHT: '20',
                LAYER: product_legend,
            });

            const wmsImageUrl = `${WMS_URL}?${mapParams.toString()}`;
            const legendGraphicUrl = `${WMS_URL}?${legendParams.toString()}`;

            setWmsImageUrl(wmsImageUrl);
            setLegendUrl(legendGraphicUrl); // Set legend URL

            // Dynamically calculate bounds
            let dynamicBounds: LatLngBoundsExpression;
            switch (modelOutput) {
                case 'NDVI':
                    dynamicBounds = [
                        [-26.520063817777775, 13.875377878611111],
                        [-8.962491589722221, 36.4787870575],
                    ];
                    break;
                case 'LULC':
                    dynamicBounds = [
                        [-26.520063817777775, 13.875377878611111],
                        [-8.962491589722221, 36.4787870575],
                    ];
                    break;
                case 'TC_PPT_ANNUAL':
                    dynamicBounds = [
                        [-18.086400000000005, 21.9948],
                        [5.0571, 41.9274],
                    ];
                    break;
                default:
                    console.error(`Unsupported modelOutput for bounds: ${modelOutput}`);
                    dynamicBounds = [
                        [-90, -180],
                        [90, 180],
                    ]; // Fallback to the global bounds
                    break;
            }

            setBounds(dynamicBounds);
        };

        fetchWMSImageAndLegend();
    }, [WMS_URL, product, style, modelOutput]); // Add modelOutput as a dependency

    return (
        <div className="map-container" style={defaultMapContainerStyle}>
            <MapContainer
                center={[2.5, 30]}
                zoom={15}
                style={defaultMapContainerStyle}
                crs={CRS.EPSG3857}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer name="Streets">
                        <TileLayer
                            url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=XJN0Iz2XNa6bkwwZTp1F"
                            tileSize={512}
                            zoomOffset={-1}
                            minZoom={1}
                            attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
                            crossOrigin={true}
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer checked name="Satellite">
                        <TileLayer
                            url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=XJN0Iz2XNa6bkwwZTp1F"
                            tileSize={512}
                            zoomOffset={-1}
                            minZoom={1}
                            attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
                            crossOrigin={true}
                        />
                    </LayersControl.BaseLayer>

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

                    {wmsImageUrl && bounds && (
                        <LayersControl.Overlay checked name="Loaded Layer">
                            <ImageOverlay
                                url={wmsImageUrl}
                                bounds={bounds}
                                opacity={1.0}
                            />
                        </LayersControl.Overlay>
                    )}
                </LayersControl>

                {/* Fit the map bounds when bounds change */}
                {bounds && <FitBoundsToSelection bounds={bounds} />}
            </MapContainer>
        </div>
    );
};

export default MapComponent;


