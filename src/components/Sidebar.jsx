import React, { useState, useEffect } from "react";
import "./Sidebar.css"; 
import { uploadCSVToSupabase } from "./csvUploader";
import { supabase } from "../supabaseClient";
import Papa from "papaparse";

export default function Sidebar({ filters, setFilters }) {
  const states = [
    "Andhra Pradesh", "Gujarat", "Assam", "Karnataka", "Tamil Nadu"
  ];

  const biomassTypes = ["Maize", "Rice", "Juliflora", "Bamboo", "Cotton"];
  const industries = ["Steel Plants", "Other Industries", "Rice Mill"];

  const boundaryOptions = [
    "District Boundary",
    "Forest Boundary",
    "Districts",
    "Taluka",
    "Village",
    "Block"
  ];

  const districtsData = {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari"],
    "Assam": ["Baksa", "Barpeta"],
    "Gujarat": ["Ahmedabad", "Surat"],
    "Karnataka": ["Bengaluru", "Mysuru"],
    "Tamil Nadu": ["Chennai", "Coimbatore"]
  };

  const handle = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const [districts, setDistricts] = useState([]);
  const [csvStatus, setCsvStatus] = useState("");

  useEffect(() => {
    if (filters.state && districtsData[filters.state]) {
      setDistricts(districtsData[filters.state]);
      handle("district", "");
    } else {
      setDistricts([]);
      handle("district", "");
    }
  }, [filters.state]);

  const handleCSVUpload = async (file) => {
    if (!file) return;
    setCsvStatus("Uploading...");
    const result = await uploadCSVToSupabase(file);
    setCsvStatus(result.message);
    if (result.success) handle("csv", file);
  };

  const handleDownloadKoboData = async () => {
    setCsvStatus("Preparing download...");
    const { data, error } = await supabase
      .from("biomass_collection")
      .select("*");

    if (error) {
      setCsvStatus("Download failed: " + error.message);
      return;
    }

    if (!data || data.length === 0) {
      setCsvStatus("No data found to download.");
      return;
    }

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Field_Data_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCsvStatus("Download complete!");
  };

  return (
    <header className="sidebar-root">
      <div className="navbar">
        <div className="brand">
          <h2>Dashboard</h2>
        </div>
        <div style={{ color: "gray", fontSize: ".9rem" }}>
          India · Biomass Map
        </div>
      </div>

      <div className="filters-row">
        <div className="filter">
          <label>Biomass Type</label>
          <select value={filters.biomass} onChange={e => handle("biomass", e.target.value)}>
            <option value="">Select</option>
            {biomassTypes.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>

        <div className="filter">
          <label>State</label>
          <select value={filters.state} onChange={e => handle("state", e.target.value)}>
            <option value="">Select</option>
            {states.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="filter">
          <label>District</label>
          <select
            value={filters.district}
            disabled={!districts.length}
            onChange={e => handle("district", e.target.value)}
          >
            <option value="">Select</option>
            {districts.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="filter">
          <label>Industries</label>
          <select value={filters.industry} onChange={e => handle("industry", e.target.value)}>
            <option value="">Select</option>
            {industries.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>

        <div className="filter">
          <label>Upload CSV</label>
          <input type="file" accept=".csv" onChange={e => handleCSVUpload(e.target.files[0])} />
        </div>

        <div className="filter">
          <label>Boundaries</label>
          <select value={filters.boundaries || ""} onChange={e => handle("boundaries", e.target.value)}>
            <option value="">Select</option>
            {boundaryOptions.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div className="field-collection-center">
        <label>Field Collection</label>

        <button onClick={() => window.open("/form", "_blank")}>
          Open Juliflora Form
        </button>

        <button onClick={handleDownloadKoboData}>
          Download Submissions
        </button>

        {csvStatus && <p className="csv-status">{csvStatus}</p>}
      </div>
    </header>
  );
}
