// components/csvUploader.js
import { supabase } from "../supabaseClient";
import Papa from "papaparse";

// Clean corruption in CSV cells
function cleanValue(val) {
  if (val === undefined || val === null) return null;

  let v = String(val).trim();

  // Remove corrupt JSON-like fragments
  v = v.replace(/^\{+|"|\}+$/g, "");

  // Remove control characters
  v = v.replace(/[\u0000-\u001F]+/g, "");

  // Replace multiple commas
  v = v.replace(/,,+/g, ",");

  // Collapse weird whitespace
  v = v.replace(/\s+/g, " ");

  // Remove accidental .csv text
  v = v.replace(/\.csv/gi, "");

  return v === "" ? null : v;
}

export async function uploadCSVToSupabase(file) {
  if (!file || !file.name.toLowerCase().endsWith(".csv")) {
    return { success: false, message: "Please upload a valid CSV file." };
  }

  try {
    // Parse CSV
    const parsed = await new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: false,
        dynamicTyping: false, // Keep all values as text first
        complete: resolve,
        error: reject,
      });
    });

    let rows = parsed.data;

    if (!rows || rows.length === 0) {
      return { success: false, message: "CSV is empty." };
    }

    // Insert each row individually
    for (let rawRow of rows) {
      let row = {};

      // Clean every cell
      Object.keys(rawRow).forEach((key) => {
        row[key] = cleanValue(rawRow[key]);
      });

      // Safe numeric conversion (Option A → empty = 0)
      const num = (v) => (v === null || v === "" ? 0 : Number(v));

      // Clean base64 image (if present)
      const cleanBase64 = (img) => {
        if (!img || typeof img !== "string") return null;
        return img.replace(/[^A-Za-z0-9+/=]/g, "");
      };

      // Prepare final row for Supabase
      const insertRow = {
        filename: file.name,
        date: row.date,
        time: row.time,
        coordinates: row.coordinates,
        district: row.district,
        state: row.state,
        taluka: row.taluka,
        village: row.village,
        grid_id: row.grid_id,
        gcp_id: row.gcp_id,
        juliflora_count: num(row.juliflora_count),
        other_species: num(row.other_species),
        juliflora_density: num(row.juliflora_density),
        image: cleanBase64(row.image),
        
        // NEW FIELDS FOR MULTIPLE IMAGES AND ACKNOWLEDGEMENT
        // Splits the Kobo photo string (e.g., "img1.jpg img2.jpg") into a Postgres array
        plant_photo: row.PLANT_PHOTO ? row.PLANT_PHOTO.split(" ") : [],
        acknowledgement: row.ACKNOWLEDGEMENT,

        // keep full row as JSON
        data: row,
      };

      // Insert into final table
      const { error } = await supabase
        .from("uploaded_csv")
        .insert(insertRow);

      if (error) {
        console.error("Insert Error:", error, "Row:", insertRow);
      }
    }

    return {
      success: true,
      message: "CSV cleaned and uploaded successfully!",
    };
  } catch (err) {
    console.error("CSV Error:", err);
    return { success: false, message: "Error parsing CSV file." };
  }
}
