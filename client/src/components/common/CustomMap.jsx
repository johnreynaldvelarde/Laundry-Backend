import { useEffect, useRef } from "react";
import L from "leaflet"; // Import L for Leaflet

const CustomMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize map only if it hasn't been initialized yet
    if (!mapRef.current) {
      // Create the map instance and assign it to mapRef.current
      mapRef.current = L.map("map").setView([13.4125, 122.5631], 13);

      // Add the tile layer to the map
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }
  }, []);

  return (
    <div
      id="map"
      style={{ height: "250px", width: "100%" }} // Style the map container
    ></div>
  );
};

export default CustomMap;
