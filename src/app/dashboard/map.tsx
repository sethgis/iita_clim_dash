

import { GoogleMap } from "@react-google-maps/api";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';



import './map.css';
import { posix } from "path";

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

// Define props interface for MapComponent
interface MapComponentProps {
  selections: Selections;
  data: Data;
}

const defaultMapContainerStyle = {
  width: '100%',
  height: '93.5vh',
};

const defaultMapCenter = {
  lng: 35.27,
  lat: -0.255,
};

const defaultMapZoom = 3;

const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: 'greedy',
  mapTypeId: 'satellite',
};


const options = {
    center: [40.731253, -73.996139] as [number, number], 
    zoom: 12,
  };

const MapComponent: React.FC<MapComponentProps> = ({ selections, data }) => {
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const leafletMapRef = useRef<any>(null); // To hold the Leaflet map reference

  useEffect(() => {
    if (leafletMapRef.current) {
      setIsLeafletLoaded(true);
    }
  }, []);

  return (
    <div className="map-container">
      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}>
      </GoogleMap>
      
      {isLeafletLoaded && (
        <MapContainer
        center={options.center}
        zoom={options.zoom}
        style={{ height: "100%", width: "100%" }}
      >

        {/* <LayerGroup>
                    {data.wmsUrl && (
                    <TileLayer url={data.wmsUrl} {...wmsOptions} />
                    )}
        </LayerGroup> */}
      </MapContainer>
      )}
    </div>
  );
};

export { MapComponent };
