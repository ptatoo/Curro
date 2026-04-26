import { useEffect, useMemo } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

interface PolylineProps {
  points: google.maps.LatLngLiteral[];
  color?: string;
}

export const RoutePolyline = ({ points, color = "var(--route-color)" }: PolylineProps) => {
  const map = useMap();
  const mapsLib = useMapsLibrary("maps");

  // Create the Polyline object only once
  const polyline = useMemo(() => {
    // If the library isn't loaded yet, we can't create a Polyline
    if (!mapsLib) return null;

    return new google.maps.Polyline({
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });
  }, [mapsLib, color]); // Re-run when mapsLib is available

  useEffect(() => {
    if (!map || !polyline) return;

    polyline.setPath(points);
    polyline.setMap(map);

    return () => {
      polyline.setMap(null);
    };
  }, [map, points, polyline]);

  return null; // This component doesn't render HTML, it just talks to the map
};
