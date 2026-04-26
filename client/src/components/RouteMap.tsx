import { Map, Polyline, useMap } from "@vis.gl/react-google-maps";
import { RoutePolyline } from "./RoutePolyLine";
import { useEffect } from "react";
import type { Coord } from "../types/runTypes";

export default function StaticRouteMap({ route }: { route: Coord[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !route.length) return;

    // 1. Create a bounds object
    const bounds = new google.maps.LatLngBounds();

    // 2. Extend the bounds for every point in your route
    route.forEach((point: any) => bounds.extend(point));

    // 3. Tell the map to fit those bounds
    // The padding adds a little space so the line isn't touching the edges
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  }, [map, route]);
  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      <Map
        defaultCenter={{ lat: 34.07141, lng: -118.43874 }}
        disableDefaultUI={true}
        zoomControl={true}
        defaultZoom={14}
        mapId={"1"}
      >
        <RoutePolyline points={route} color="#FF0000" />
      </Map>
    </div>
  );
}
