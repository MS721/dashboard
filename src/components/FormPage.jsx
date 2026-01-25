import React from "react";

export default function FormPage() {
  // Replace this with your actual Kobo Enketo Link
  const koboFormUrl = "https://ee.kobotoolbox.org/x/mxcFWuJf";

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      <nav style={{ 
        padding: "10px 20px", 
        background: "#2c3e50", 
        color: "white", 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h3 style={{ margin: 0 }}>Juliflora Survey Form</h3>
        <button 
          onClick={() => window.close()} 
          style={{ 
            padding: "5px 15px", 
            cursor: "pointer", 
            background: "#e74c3c", 
            color: "white", 
            border: "none", 
            borderRadius: "4px" 
          }}
        >
          Close Form
        </button>
      </nav>

      <iframe
        src={koboFormUrl}
        title="Kobo Form"
        style={{
          flex: 1,
          width: "100%",
          border: "none"
        }}
      />
    </div>
  );
}
