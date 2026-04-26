import { useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface Props {
  onPlaceSelect: (lat: number, lng: number) => void;
}

export default function PlaceAutocomplete({ onPlaceSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const placesLibrary = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLibrary || !containerRef.current) return;

    // Create element
    const autocompleteElem = document.createElement(
      "gmp-place-autocomplete",
    ) as any;

    // Explicitly style the custom element
    autocompleteElem.style.width = "100%";
    autocompleteElem.setAttribute("picker-layout", "overlay");

    // 3. Optional: Prevent the input from scaling fonts (which can cause zoom-jumps)
    autocompleteElem.style.fontSize = "16px";

    const handleSelect = async (event: any) => {
      const place = event.place;
      if (!place.location) {
        await place.fetchFields({ fields: ["location"] });
      }
      onPlaceSelect(place.location.lat(), place.location.lng());
    };

    autocompleteElem.addEventListener("gmp-select", handleSelect);

    const container = containerRef.current;
    container.innerHTML = "";
    container.appendChild(autocompleteElem);

    return () => {
      autocompleteElem.removeEventListener("gmp-select", handleSelect);
      if (container.contains(autocompleteElem)) {
        container.removeChild(autocompleteElem);
      }
    };
    // Note: If onPlaceSelect changes frequently, wrap it in useCallback in the parent!
  }, [placesLibrary, onPlaceSelect]);

  return (
    <div style={searchContainerStyle}>
      <div
        ref={containerRef}
        style={{ width: "100%", minHeight: "40px", display: "block" }}
      />
      {!placesLibrary && <p>Loading Search...</p>}
    </div>
  );
}

const searchContainerStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "50px",
  position: "relative",
  padding: "10px 0",
  zIndex: 1000, // Ensure it stays on top of the map but within its slot
};
