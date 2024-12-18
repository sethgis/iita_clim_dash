
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import L from 'leaflet';
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
import { count } from 'console';

interface Selections {
    country: string;
    modelOutput: string;
    year: string;
    month:string;
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

    const { country, modelOutput, year, month, season } = selections; 

    // Set default WMS URL and product
    let WMS_URL = `http://5.252.54.37:8080/geoserver/Climate/wms`;
    let product = 'Climate:NDVI_1983_2005';
    let product_legend = 'Climate:NDVI_1983_2005';
    let style = 'Climate:NDVI_1983_2005';
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
     


    } 
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
     


    }else if (modelOutput === 'FARM_BOUNDARY') {
        let years = `${year}`
        WMS_URL = `http://5.252.54.37:8080/geoserver/Climate/wms`;
        product = `Climate%3Asevalugu_bounds_ghana`;
        product_legend = `POLYGON`;
        bbox = '-0.85, 9.6, -0.83, 9.6';
        // {
        //   "west": -0.8598664182549669,
        //   "south": 9.653566995254991,
        //   "east": -0.8360767995388301,
        //   "north": 9.677858061101176
        // }
        // bbox = '3.0,4.73, 1.1918, 11.1733';
        
       
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

    }else if (modelOutput === 'TC_PPT_ANNUAL') {
        product = `Climate:TC_PPT_ANNUAL`;
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

    }else if (modelOutput === 'NDVI_Trend') {
        product = `Climate:NDVI_Trend`;
        product_legend = "Climate:NDVI_1983_2005";
        bbox = '21.9948,-18.086400000000005,41.9274,5.0571';
        if (country === 'MALAWI') {
            style = `NDVI_Trend_Malawi`;
        } else if (country === 'ZAMBIA'){
          style = `NDVI_Trend_Zambia`;
        }else if (country === 'TANZANIA'){
          style = `NDVI_Trend_Tanzania`;
        }else if (country === 'UGANDA'){
          style = `NDVI_Trend_Uganda`;
        }else if (country === 'KENYA'){
          style = `NDVI_Trend_Kenya`;
        }else if (country === 'BURUNDI'){
          style = `NDVI_Trend_Burundi`
        }else if (country === 'RWANDA'){
          style = `NDVI_Trend_Rwanda`
        }

    } else if (
      modelOutput === 'Yield_Advantage_DK8053' ||
      modelOutput === 'Yield_Advantage_PAN53' ||
      modelOutput === 'Yield_Advantage_SC719' ||
      modelOutput === 'Yield_Advantage_ZM309'
  ) {
      product = `Climate:${modelOutput}_${year}`;
      product_legend = "Climate:NDVI_1983_2005";
      bbox = '21.9948,-18.086400000000005,41.9274,5.0571';
  
      switch (country) {
          case 'MALAWI':
              style = 'Yield_Advantage_Malawi';
              break;
          case 'ZAMBIA':
              style = 'Yield_Advantage_Zambia';
              break;
          case 'ZIMBABWE':
                style = 'Yield_Advantage_Zimbabwe';
                break;
          case 'TANZANIA':
              style = 'Yield_Advantage_Tanzania';
              break;
          case 'UGANDA':
              style = 'Yield_Advantage_Uganda';
              break;
          case 'KENYA':
              style = 'Yield_Advantage_Kenya';
              break;
          case 'BURUNDI':
              style = 'Yield_Advantage_Burundi';
              break;
          case 'RWANDA':
              style = 'Yield_Advantage_Rwanda';
              break;
          default:
              style = 'Yield_Advantage'; // Fallback in case no country matches
              break;
      }
  } else if (
    modelOutput === 'Cumulative_wet_days_Laos' ||
    modelOutput === 'Cumulative_dry_days_Laos' ||
    modelOutput === 'Rainfall_Cessation_Laos' ||
    modelOutput === 'Rainfall_Onset_Laos' ||
    modelOutput === 'Length_Growing_Period_Laos' ||
    modelOutput === 'Rainfall_Total_Mean_Laos' ||
    modelOutput === 'r20_Laos') 
    {
    product = `Climate:${modelOutput}`;
    product_legend = "Climate:NDVI_1983_2005";
    // bbox = '7.679066, 101.644584, 24.992666, 110.96463'
    bbox =  '98.999993862, 12.999997709, 108.000006138, 22.999998476'
    // bbox = '7.679066, 101.644584, 24.992666, 110.96463';

    switch (country) {
        case 'Laos':
            style = `Cummulative_wet_days_Laos`;
            break;
        default:
            style = 'NDVI_Trend_Default'; // Fallback in case no country matches
            break;
    }
  }
  else if (
    modelOutput === 'TC_PPT_MAX' ||
    modelOutput === 'TC_PPT_MIN' ||
    modelOutput === 'TC_PPT') 
    {
    product = `Climate:${modelOutput}_${month}`;
    product_legend = "Climate:NDVI_1983_2005";
    bbox = '21.9948,-18.086400000000005,41.9274,5.0571';

    switch (country) {
      case 'MALAWI':
          style = 'TC_PPT_MAX_Malawi';
          break;
      case 'ZAMBIA':
          style = 'TC_PPT_MAX_Zambia';
          break;
      case 'TANZANIA':
          style = 'TC_PPT_MAX_Tanzania';
          break;
      case 'UGANDA':
          style = 'TC_PPT_MAX_Uganda';
          break;
      case 'KENYA':
          style = 'TC_PPT_MAX_Kenya';
          break;
      case 'BURUNDI':
          style = 'TC_PPT_MAX_Burundi';
          break;
      case 'RWANDA':
          style = 'TC_PPT_MAX_Rwanda';
          break;
      default:
          style = 'TC_PPT_MAX_Uganda'; // Fallback in case no country matches
          break;
  }
  }
  


    // NDVI_Trend
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
        
          let wmsImageUrl: string;
          if (country === 'Laos') {
            wmsImageUrl = `${WMS_URL}?${mapParams.toString()}`;
            // wmsImageUrl = `${WMS_URL}?service=WMS&version=1.1.0&request=GetMap&layers=Climate%3A${modelOutput}&bbox=98.999993862%2C12.999997709%2C108.000006138%2C22.999998476&width=691&height=768&srs=EPSG%3A4326&styles=Cummulative_wet_days_Laos&format=image%2Fpng`;
            console.log("CREATED_WMS_URL_IN_LEAFLET", wmsImageUrl)

        } else {
            wmsImageUrl = `${WMS_URL}?${mapParams.toString()}`;
            console.log("CREATED_WMS_URL_IN_LEAFLET", wmsImageUrl);
        }
          // const wmsImageUrl = `${WMS_URL}?${mapParams.toString()}`;
          // console.log("CREATED_WMS_URL_IN_LEAFLET", wmsImageUrl);
            
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
                case 'NDVI_Trend':
                    dynamicBounds = [
                        [-18.086400000000005, 21.9948],
                        [5.0571, 41.9274],
                    ];
                break;
                case 'FARM_BOUNDARY_2':
                      dynamicBounds = [
                          [-18.086400000000005, 17.9948],
                          [5.0571, 41.9274],
                      ];
                      break;

                case 'Cumulative_wet_days_Laos':
                case 'Cumulative_dry_days_Laos':
                case 'Rainfall_Cessation_Laos':
                case 'Rainfall_Onset_Laos':
                case 'Rainfall_Total_Mean_Laos':
                case 'Length_Growing_Period_Laos':
                case 'r20_Laos':
                    dynamicBounds = [
                      // [7.679066, 101.644584], [24.992666, 110.96463]

                      [12.999997709,98.999993862],[22.999998476, 108.000006138]
  
                    ]; break;
                case 'FARM_BOUNDARY':
                    dynamicBounds = [
                      // [7.679066, 101.644584], [24.992666, 110.96463]

                      [4.2,-3.2],[11.3, 1.0]
                      
                    ]; break;
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
                                opacity={0.8}
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
