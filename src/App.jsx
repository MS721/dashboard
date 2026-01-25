import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import FormPage from "./components/FormPage"; // ✅ We will create this file next
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
    <Router>
      <Routes>
        {/* ROUTE 1: Your Main Dashboard */}
        <Route 
          path="/" 
          element={
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
          } 
        />

        {/* ROUTE 2: The New Form Page */}
        <Route path="/form-placeholder" element={<FormPage />} />
      </Routes>
    </Router>
  );
}
