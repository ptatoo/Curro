import { useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import type { MapMouseEvent } from "@vis.gl/react-google-maps";
import PlaceAutocomplete from "./PlaceAutocomplete";

interface Props {
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapPicker = ({ onLocationSelect }: Props) => {
  // Default center (e.g., Los Angeles)
  const [markerPos, setMarkerPos] = useState({ lat: 34.0522, lng: -118.2437 });
  //const map = useMap();

  const handleMapClick = (e: MapMouseEvent) => {
    if (e.detail.latLng) {
      const { lat, lng } = e.detail.latLng;
      setMarkerPos({ lat, lng });
      onLocationSelect(lat, lng);
    }
  };

  return (
    <div
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <PlaceAutocomplete onPlaceSelect={() => {}} />
      </APIProvider>
    </div>
  );
};

export default MapPicker;
