import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import FormPage from "./components/FormPage"; // ✅ Make sure to create this file
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
        {/* Main Dashboard Route */}
        <Route 
          path="/" 
          element={
            <div className="app-root">
              <div className="bg-layer" />
              <Sidebar filters={filters} setFilters={setFilters} />
              <main className="main-content">
                <MapView filters={filters} />
              </main>
            </div>
          } 
        />

        {/* Form Page Route */}
        <Route path="/form-placeholder" element={<FormPage />} />
      </Routes>
    </Router>
  );
}
