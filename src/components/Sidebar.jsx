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
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Krishna", "Kurnool", "Prakasam", "Nellore", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari"],
    "Arunachal Pradesh": ["Anjaw", "Changlang", "East Kameng", "East Siang", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Dibang Valley", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"],
    "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Long", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Long"],
    "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
    "Goa": ["North Goa", "South Goa"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
    "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
    "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum"],
    "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    "Tamil Nadu": ["Ariyalur", "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruppur", "Trichy", "Vellore"]
  };

  const handle = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

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
    if (result.success) {
      handle("csv", file);
    }
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
    link.setAttribute("download", `Field_Data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCsvStatus("Download complete!");
  };

  return (
    <header className="sidebar-root" role="banner">
      <div className="navbar">
        <div className="brand">
          <div className="logo">B</div>
          <h2>Dashboard</h2>
        </div>
        <div style={{ color: "gray", fontSize: ".9rem" }}>
          India · Biomass Map
        </div>
      </div>

      <div className="filters-card" role="form" aria-label="Filters">
        <div className="filter">
          <label htmlFor="biomass">Biomass Type:</label>
          <div className="select">
            <select
              id="biomass"
              value={filters.biomass}
              onChange={e => handle("biomass", e.target.value)}
            >
              <option value="">Select</option>
              {biomassTypes.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div className="filter">
          <label htmlFor="state">State:</label>
          <div className="select">
            <select
              id="state"
              value={filters.state}
              onChange={e => handle("state", e.target.value)}
            >
              <option value="">Select</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="filter">
          <label htmlFor="district">District:</label>
          <div className="select">
            <select
              id="district"
              value={filters.district}
              onChange={e => handle("district", e.target.value)}
              disabled={districts.length === 0}
            >
              <option value="">Select</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="filter">
          <label htmlFor="industry">Industries:</label>
          <div className="select">
            <select
              id="industry"
              value={filters.industry}
              onChange={e => handle("industry", e.target.value)}
            >
              <option value="">Select</option>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>

        <div className="filter">
          <label htmlFor="csv">Upload CSV:</label>
          <input
            type="file"
            id="csv"
            accept=".csv"
            onChange={e => handleCSVUpload(e.target.files[0])}
          />
          {csvStatus && <p style={{ fontSize: "0.85rem", color: "#555" }}>{csvStatus}</p>}
        </div>

        <div className="filter">
          <label htmlFor="boundaries">Boundaries:</label>
          <div className="select">
            <select
              id="boundaries"
              value={filters.boundaries || ""}
              onChange={e => handle("boundaries", e.target.value)}
            >
              <option value="">Select</option>
              {boundaryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        <div className="filter" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label>Field Collection:</label>
          <button
            type="button"
            className="sidebar-form-btn"
            onClick={() => window.open("/form", "_blank")}
            style={{
              padding: "10px",
              width: "100%",
              backgroundColor: "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Open Juliflora Form
          </button>

          <button
            type="button"
            className="sidebar-download-btn"
            onClick={handleDownloadKoboData}
            style={{
              padding: "10px",
              width: "100%",
              backgroundColor: "#2980b9",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Download Submissions
          </button>
        </div>
      </div>
    </header>
  );
}
