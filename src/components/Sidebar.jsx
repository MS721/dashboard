import React from "react";
import "./Sidebar.css";

/**
 * Sidebar: navbar + filter dropdowns
 * Props: filters (object), setFilters (function)
 */
export default function Sidebar({ filters, setFilters }) {
  // Full list of Indian states & UTs
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const biomassTypes = ["Cotton", "Rice", "Juliflora", "Bamboo"];
  const districts = ["Nagpur", "Amritsar", "Chennai", "Ahmedabad"];
  const industries = ["Steel Plants", "Other Industries"];

  const handle = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <header className="sidebar-root" role="banner">
      <div className="navbar">
        <div className="brand">
          <div className="logo">B</div>
          <h2>Dashboard</h2>
        </div>
        <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>
          India · Biomass Map
        </div>
      </div>

      <div className="filters-card" role="form" aria-label="Filters">
        {/* Biomass filter */}
        <div className="filter">
          <label htmlFor="biomass">Biomass Type:</label>
          <div className="select">
            <select
              id="biomass"
              value={filters.biomass}
              onChange={e => handle("biomass", e.target.value)}
            >
              <option value="">Select</option>
              {biomassTypes.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* State filter */}
        <div className="filter">
          <label htmlFor="state">State:</label>
          <div className="select">
            <select
              id="state"
              value={filters.state}
              onChange={e => handle("state", e.target.value)}
            >
              <option value="">Select</option>
              {states.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* District filter */}
        <div className="filter">
          <label htmlFor="district">District:</label>
          <div className="select">
            <select
              id="district"
              value={filters.district}
              onChange={e => handle("district", e.target.value)}
            >
              <option value="">Select</option>
              {districts.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Industry filter */}
        <div className="filter">
          <label htmlFor="industry">Industries:</label>
          <div className="select">
            <select
              id="industry"
              value={filters.industry}
              onChange={e => handle("industry", e.target.value)}
            >
              <option value="">Select</option>
              {industries.map(i => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
