import React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import PlaceAutocomplete from "../components/PlaceAutocomplete";

const NewUser = () => {
  return (
    <div>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <PlaceAutocomplete onPlaceSelect={() => {}} />
        <div className={"h-10"} />
      </APIProvider>
    </div>
  );
};

export default NewUser;
