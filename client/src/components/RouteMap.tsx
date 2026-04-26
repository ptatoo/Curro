import { Map, Polyline, useMap } from "@vis.gl/react-google-maps";
import { RoutePolyline } from "./RoutePolyLine";
import { useEffect } from "react";

export default function StaticRouteMap({ route }: { route: string }) {
  console.log(route);
  const points = JSON.parse(route);
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    // 1. Create a bounds object
    const bounds = new google.maps.LatLngBounds();

    // 2. Extend the bounds for every point in your route
    points.forEach((point: any) => bounds.extend(point));

    // 3. Tell the map to fit those bounds
    // The padding adds a little space so the line isn't touching the edges
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  }, [map, points]);
  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      <Map
        defaultCenter={{ lat: 34.07141, lng: -118.43874 }}
        defaultZoom={14}
        mapId={"1"}
      >
        <RoutePolyline
          points={[
            { lat: 34.07141, lng: -118.43874 },
            { lat: 34.06853, lng: -118.43362 },
            { lat: 34.06737, lng: -118.43155 },
          ]}
          color="#FF0000"
        />
      </Map>
    </div>
  );
}
