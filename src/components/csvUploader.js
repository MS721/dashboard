// components/csvUploader.js
import { supabase } from "../supabaseClient";
import Papa from "papaparse";

export async function uploadCSVToSupabase(file) {
  if (!file || !file.name.toLowerCase().endsWith(".csv")) {
    return { success: false, message: "Please upload a valid CSV file." };
  }

  try {
    // Parse CSV safely
    const parsed = await new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,    // we will handle typing manually
        complete: resolve,
        error: reject,
      });
    });

    const rows = parsed.data;

    if (!rows || rows.length === 0) {
      return { success: false, message: "CSV is empty." };
    }

    // Allowed table columns
    const allowedColumns = [
      "filename",
      "date",
      "time",
      "coordinates",
      "district",
      "state",
      "taluka",
      "village",
      "grid_id",
      "gcp_id",
      "juliflora_count",
      "other_species",
      "juliflora_density",
      "image"
    ];

    // Format rows to match schema exactly
    const formattedRows = rows.map((row) => {
      const cleaned = {};

      allowedColumns.forEach((col) => {
        let val = row[col];

        // treat empty strings or undefined as null
        if (val === "" || val === undefined) val = null;

        // Convert numeric columns
        if (
          ["juliflora_count", "other_species", "juliflora_density"].includes(col)
        ) {
          cleaned[col] = val !== null && !isNaN(val) ? Number(val) : null;
        }

        // Convert image base64 (safe)
        else if (col === "image") {
          cleaned.image = val ? val : null;
        }

        // Strings
        else {
          cleaned[col] = val;
        }
      });

      // add filename for each row
      cleaned.filename = file.name;

      return cleaned;
    });

    console.log("Formatted rows:", formattedRows);

    // Insert into Supabase
    const { error } = await supabase.from("uploaded_csv").insert(formattedRows);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return { success: false, message: "Failed to insert rows." };
    }

    return { success: true, message: "CSV uploaded successfully!" };
  } catch (err) {
    console.error("CSV Parsing Error:", err);
    return { success: false, message: "Error parsing CSV file." };
  }
}
