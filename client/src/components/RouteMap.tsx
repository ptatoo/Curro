import { Map, Polyline } from "@vis.gl/react-google-maps";
import { RoutePolyline } from "./RoutePolyLine";

export default function StaticRouteMap() {
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
