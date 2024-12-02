
import React, { useEffect, useState } from 'react';

// Access-Control-Allow-origin: *

import {
    MapContainer,
    TileLayer,
    LayersControl,
    ImageOverlay,
    useMap,
    WMSTileLayer,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { CRS, LatLngBoundsExpression } from 'leaflet';

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

// Custom hook to fit the bounds when they change
const FitBoundsToSelection = ({ bounds }: { bounds: LatLngBoundsExpression | null }) => {
    const map = useMap();

    useEffect(() => {
        if (bounds) {
            map.flyToBounds(bounds, {
                maxZoom: 18, // Prevent zooming in too much
                duration: 1, // Smooth transition in seconds
                easeLinearity: 0.25, // Smoother easing
            });
        }
    }, [bounds, map]);

    return null;
};

// Custom hook to set a default zoom level for a specific layer
const SetZoomForLayer = ({ zoom }: { zoom: number }) => {
    const map = useMap();

    useEffect(() => {
        map.setZoom(zoom);
    }, [map, zoom]);

    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ selections }) => {
    const [wmsImageUrl, setWmsImageUrl] = useState<string | null>(null);
    const [legendUrl, setLegendUrl] = useState<string | null>(null); // State for legend URL
    const [bounds, setBounds] = useState<LatLngBoundsExpression | null>(null);

    const { country, modelOutput, year, season } = selections; 

    // Set default WMS URL and product
    let WMS_URL = `http://5.252.54.37:8080/geoserver/Climate/wms`;
    let product = '';
    let product_legend = '';
    let style = '';
    let bbox = '';

    if (modelOutput === 'NDVI') {
        WMS_URL = `http://5.252.54.37:8080/geoserver/Climate/wms`;
        product_legend = `Climate:NDVI_1983_2005`;
        console.log("NDVI LEGEND",  product_legend)
        
        product = `Climate:${modelOutput}_${year}`;
        console.log('NDVI_PRODUCT', product)
        // style = `${modelOutput}_${country}`;
        bbox = '21.9948,-18.086400000000005,41.9274,5.0571';
        if (country === 'MALAWI') {
            style = `NDVI_Malawi`;
        } else if (country === 'ZAMBIA'){
          style = `NDVI_Zambia`;
        }else if (country === 'TANZANIA'){
          style = `NDVI_Tanzania`;
        }else if (country === 'UGANDA'){
          style = `NDVI_Uganda`;
        }else if (country === 'KENYA'){
          style = `NDVI_Kenya`;
        }else if (country === 'BURUNDI'){
          style = `NDVI_Burundi`
        }else if (country === 'RWANDA'){
          style = `NDVI_Rwanda`
        }
     


    } else if (modelOutput === 'NDVI_Rainfall_Correlation') {
        let years = `${year}`
        product = `Climate:NDVI_Rainfall_Correlation_${year}`;
        product_legend = `Climate:NDVI_1983_2005`;
        
        bbox = '21.9948,-18.086400000000005,41.9274,5.0571';
        
          
          if (country === 'MALAWI') {
              style = `NDVI_Rainfall_Correlation_Malawi`;
          } else if (country === 'ZAMBIA'){
            style = `NDVI_Rainfall_Correlation_Zambia`;
          }else if (country === 'TANZANIA'){
            style = `NDVI_Rainfall_Correlation_Tanzania`;
          }else if (country === 'UGANDA'){
            style = `NDVI_Rainfall_Correlation_Uganda`;
          }else if (country === 'KENYA'){
            style = `NDVI_Rainfall_Correlation_Kenya`;
          }else if (country === 'BURUNDI'){
            style = `NDVI_Rainfall_Correlation_Kenya`
          }else if (country === 'RWANDA'){
            style = `NDVI_Rainfall_Correlation_Kenya`
          }
       
    } else if (modelOutput === 'Precipitation') {
        let years = `${year}`
        if (year === '1983_2005') {
            product = `Climate:Precipitation_${years}`;
            // Precipitation_1983_2005
        }else if (year === '2006_2022'){
            product = `Climate:Precipitation_${years}`
        }
        product_legend = `Climate:NDVI_1983_2005`;
        bbox = '21.9948,-18.086400000000005,41.9274,5.0571';
        
          
          if (country === 'MALAWI') {
              style = `Precipitation_Malawi`;
          } else if (country === 'ZAMBIA'){
            style = `Precipitation_Zambia`;
          }else if (country === 'TANZANIA'){
            style = `Precipitation_Tanzania`;
          }else if (country === 'UGANDA'){
            style = `Precipitation_Uganda`;
          }else if (country === 'KENYA'){
            style = `Precipitation_Kenya`;
          }else if (country === 'BURUNDI'){
            style = `Precipitation_Burundi`
          }else if (country === 'RWANDA'){
            style = `Precipitation_Rwanda`
          }

    } else if (modelOutput === 'Precipitation_Long_Term_Mean') {
        product = `Climate:Precipitation_Long_Term_Mean_${year}`;
        product_legend = "Climate:NDVI_1983_2005";
        bbox = '21.9948,-18.086400000000005,41.9274,5.0571';
        if (country === 'MALAWI') {
            style = `Precipitation_Malawi`;
        } else if (country === 'ZAMBIA'){
          style = `Precipitation_Zambia`;
        }else if (country === 'TANZANIA'){
          style = `Precipitation_Tanzania`;
        }else if (country === 'UGANDA'){
          style = `Precipitation_Uganda`;
        }else if (country === 'KENYA'){
          style = `Precipitation_Kenya`;
        }else if (country === 'BURUNDI'){
          style = `Precipitation_Burundi`
        }else if (country === 'RWANDA'){
          style = `Precipitation_Rwanda`
        }

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
            console.log("CREATED_WMS_URL",wmsImageUrl)
            fetch(wmsImageUrl)
                .then(response => {
                    if (response.status === 200) {
                    console.log("WMS URL is valid, layer exists.");
                    } else {
                    console.error("The layer does not exist.");
                    alert("The layer does not exist.");
                    }
                })
            const legendGraphicUrl = `${WMS_URL}?${legendParams.toString()}`;
            console.log("CREATED_legend graphic",legendGraphicUrl)

            setWmsImageUrl(wmsImageUrl);
            setLegendUrl(legendGraphicUrl); // Set legend URL
    
            let dynamicBounds: LatLngBoundsExpression;
            switch (modelOutput) {
                case 'LULC':
                    dynamicBounds = [
                        [-26.520063817777775, 13.875377878611111],
                        [-8.962491589722221, 36.4787870575],
                    ];
                    break;
                case 'TC_PPT_ANNUAL':
                case 'NDVI':
                case 'NDVI_Rainfall_Correlation':
                case 'Precipitation':
                case 'Precipitation_Long_Term_Mean':
                    dynamicBounds = [
                        [-18.086400000000005, 21.9948],
                        [5.0571, 41.9274],
                    ];
                    break;
                default:
                    console.error(`Unsupported modelOutput for bounds: ${modelOutput}`);
                    dynamicBounds = [
                        [-18.086400000000005, 21.9948],
                        [5.0571, 41.9274],
                    ]; // Fallback to the global bounds
                    break;
            }

            setBounds(dynamicBounds);
        };

        fetchWMSImageAndLegend();
    }, [WMS_URL, product, style, modelOutput]); // Add modelOutput as a dependency

    return (
        <div className="map-container" style={defaultMapContainerStyle}>
            <MapContainer center={[2.5, 30]} zoom={15} style={defaultMapContainerStyle} crs={CRS.EPSG3857}>
                <LayersControl position="topright">
                    <LayersControl.BaseLayer name="Streets">
                        <TileLayer
                            url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=U4sD8FQ673dzD6SMpeHM"
                            tileSize={512}
                            zoomOffset={-1}
                            minZoom={1}
                            attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
                            // crossOrigin={true}
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer checked name="Satellite">
                        <>
                            <TileLayer
                                url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=U4sD8FQ673dzD6SMpeHM"
                                tileSize={512}
                                zoomOffset={-1}
                                minZoom={1}
                                attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
                                // crossOrigin={true}
                            />
                            <SetZoomForLayer zoom={15} />
                        </>
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Topographic">
                        <TileLayer
                            url="https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=U4sD8FQ673dzD6SMpeHM"
                            tileSize={512}
                            zoomOffset={-1}
                            minZoom={1}
                            attribution="&copy; MapTiler &copy; OpenStreetMap contributors"
                            
                            // crossOrigin={true}
                            
                        />
                    </LayersControl.BaseLayer>

                    {wmsImageUrl && bounds && (
                        <LayersControl.Overlay checked name="Loaded Layer">
                            <ImageOverlay
                                url={wmsImageUrl}
                                bounds={bounds}
                                opacity={1.0}
                                crossOrigin={true}
                            />
                        </LayersControl.Overlay>
                    )}

                    {legendUrl && (
                        <div className="legend-container" style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000 }}>
                            <img src={legendUrl} alt="Legend" style={{ width: '100px', height: 'auto' }} />
                        </div>
                    )}
                </LayersControl>

                {/* Fit the map bounds when bounds change */}
                {bounds && <FitBoundsToSelection bounds={bounds} />}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
