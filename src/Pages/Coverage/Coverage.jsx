// src/pages/Coverage.jsx
import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 📦 Import your warehouse/coverage data
import warehouses from "../../assets/warehouses.json";

// 🔧 Fix Leaflet default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🗺️ Custom hook to control map from outside
const MapController = ({ searchQuery, filteredWarehouses }) => {
  const map = useMap();

  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      // Reset to full view
      map.setView([23.685, 90.3563], 7);
      return;
    }

    if (filteredWarehouses.length > 0) {
      const first = filteredWarehouses[0];
      map.setView([first.latitude, first.longitude], 10); // Zoom in
    }
  }, [searchQuery, filteredWarehouses, map]);

  return null;
};

const Coverage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef();

  // 🇧🇩 Define Bangladesh bounds
  const bangladeshBounds = [
    [20.5, 88.0],
    [26.5, 92.5],
  ];

  // 🔍 Filter warehouses based on search (district or covered area)
  const filteredWarehouses = warehouses.filter((district) => {
    if (!searchQuery.trim()) return true; // Show all if empty

    const query = searchQuery.toLowerCase();
    const matchesDistrict = district.district.toLowerCase().includes(query);
    const matchesArea = district.covered_area.some((area) =>
      area.toLowerCase().includes(query)
    );
    return matchesDistrict || matchesArea;
  });

  // 🌍 Map settings
  const mapCenter = [23.685, 90.3563];
  const zoomLevel = 7;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-base-100 rounded-xl shadow-lg">
      {/* 📌 Main Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        We are available in 64 districts
      </h1>

      {/* 🔍 Search Box */}
      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search district or area (e.g. Dhaka, Uttara)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          className="px-4 py-2 bg-[#CAEB66] text-black rounded-2xl  transition"
          onClick={() => setSearchQuery("")}
        >
          {searchQuery ? "Reset" : "Search"}
        </button>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* 📦 Subtitle */}
      <h2 className="text-xl font-medium text-gray-700 mb-4">
        We deliver almost all over Bangladesh
      </h2>

      {/* 🗺️ Map Container */}
      <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 shadow-md">
        <MapContainer
          ref={mapRef}
          center={mapCenter}
          zoom={zoomLevel}
          scrollWheelZoom={true}
          className="w-full h-full"
          maxBounds={bangladeshBounds}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 📍 Render only filtered markers */}
          {filteredWarehouses.map((district, index) => {
            if (district.status !== "active") return null;
            return (
              <Marker
                key={index}
                position={[district.latitude, district.longitude]}
              >
                <Popup>
                  <div className="font-bold text-green-700">
                    {district.district}
                  </div>
                  <div className="mt-1 text-sm">
                    <strong>Covered areas:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {district.covered_area.map((area, i) => (
                        <li key={i} className="text-gray-700">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {district.flowchart && (
                    <div className="mt-2">
                      <a
                        href={district.flowchart.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View delivery flowchart
                      </a>
                    </div>
                  )}
                </Popup>
              </Marker>
            );
          })}

          {/* 🧠 Map controller to auto-zoom */}
          <MapController
            searchQuery={searchQuery}
            filteredWarehouses={filteredWarehouses}
          />
        </MapContainer>
      </div>

      {/* 💡 Optional: Show count of results */}
      {searchQuery && (
        <p className="mt-4 text-sm text-gray-600">
          {filteredWarehouses.length} district(s) found for "{searchQuery}"
        </p>
      )}
    </div>
  );
};

export default Coverage;
