import React from "react";

const FormPage = () => {
  const koboFormUrl = "https://ee.kobotoolbox.org/x/mxcFWuJf";

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#f4f4f4" }}>
      {/* Optional Header to allow users to return */}
      <div style={{ 
        padding: "15px", 
        background: "#2c3e50", 
        color: "white", 
        display: "flex", 
        alignItems: "center" 
      }}>
        <button 
          onClick={() => window.history.back()}
          style={{ 
            marginRight: "20px", 
            cursor: "pointer", 
            padding: "5px 10px",
            borderRadius: "4px",
            border: "none"
          }}
        >
          ← Back to Map
        </button>
        <h3 style={{ margin: 0 }}>Juliflora Survey Form</h3>
      </div>

      {/* The Iframe that displays the form */}
      <iframe
        src={koboFormUrl}
        title="Kobo Survey Form"
        style={{
          width: "100%",
          height: "calc(100% - 60px)", // Subtracts header height
          border: "none",
        }}
      />
    </div>
  );
};

export default FormPage;
