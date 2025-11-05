import React, { useEffect, useMemo } from "react";

export default function MapView({ filters }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Compute map URL dynamically (case-insensitive)
  const mapUrl = useMemo(() => {
    const state = (filters.state || "").trim().toLowerCase();
    const biomass = (filters.biomass || "").trim().toLowerCase();

    // Case-insensitive rules
    if (state === "gujarat" && biomass === "juliflora") {
      return "https://pranavclimitra001.users.earthengine.app/view/class1fullgujarat";
    }
    if (state === "karnataka" && biomass === "cotton") {
      return "https://pranavclimitra001.users.earthengine.app/view/cotton";
    }
    if (state === "assam" && biomass === "bamboo") {
      return "https://pranavclimitra001.users.earthengine.app/view/bambooinkrabi";
    }

    // Default fallback map
    return "https://pranavclimitra001.users.earthengine.app/view/class1fullgujarat";
  }, [filters.state, filters.biomass]);

  return (
    <div
      style={{
        height: "calc(100vh - 220px)",
        width: "100%",
        overflow: "hidden",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        marginTop: "1rem",
      }}
    >
      <iframe
        key={mapUrl}
        src={mapUrl}
        title="Earth Engine Map"
        width="100%"
        height="100%"
        style={{
          border: "none",
          borderRadius: "12px",
          transform: "scale(1.02)",
          transformOrigin: "center center",
        }}
        allowFullScreen
      ></iframe>
    </div>
  );
}
