import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import "./App.css";

export default function App() {
  const [filters, setFilters] = useState({
    biomass: "",
    state: "",
    district: "",
    industry: "",
    boundaries: "",
    csv: null
  });

  return (
    <div className="app-root">
      {/* Background layer */}
      <div className="bg-layer" />

      {/* Sidebar (navbar + filters) */}
      <Sidebar filters={filters} setFilters={setFilters} />

      {/* Main map section */}
      <main className="main-content">
        <MapView filters={filters} />
      </main>
    </div>
  );
}
