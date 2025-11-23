// components/csvUploader.js
import { supabase } from "../supabaseClient";
import Papa from "papaparse";

function cleanValue(val) {
  if (val === undefined || val === null) return null;
  if (typeof val === "number") return val;

  let v = String(val).trim();

  // Remove broken JSON fragments
  v = v.replace(/^\{+|"|\}+$/g, "");

  // Remove unwanted special characters
  v = v.replace(/[\u0000-\u001F]+/g, "");

  // If looks like corrupted pattern, fix simple issues
  v = v.replace(/,,+/g, ",");
  v = v.replace(/\s+/g, " ");

  // Clean .csv from district names
  v = v.replace(/\.csv/gi, "");

  return v === "" ? null : v;
}

export async function uploadCSVToSupabase(file) {
  if (!file || !file.name.toLowerCase().endsWith(".csv")) {
    return { success: false, message: "Please upload a valid CSV file." };
  }

  try {
    const parsed = await new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: false,
        dynamicTyping: true,
        complete: resolve,
        error: reject,
      });
    });

    let rows = parsed.data;

    if (!rows || rows.length === 0) {
      return { success: false, message: "CSV is empty." };
    }

    const filenameNoExt = file.name.replace(".csv", "");

    for (let row of rows) {
      // CLEAN ALL FIELDS
      Object.keys(row).forEach((key) => {
        row[key] = cleanValue(row[key]);
      });

      // Force district name from filename if missing or corrupted
      if (!row.district || row.district.length < 3) {
        row.district = filenameNoExt;
      }

      // Prepare final object matching your Supabase schema
      const insertRow = {
        filename: file.name,
        date: cleanValue(row.date),
        time: cleanValue(row.time),
        coordinates: cleanValue(row.coordinates),
        district: cleanValue(row.district),
        state: cleanValue(row.state),
        taluka: cleanValue(row.taluka),
        village: cleanValue(row.village),
        grid_id: cleanValue(row.grid_id),
        gcp_id: cleanValue(row.gcp_id),

        // Convert numeric fields safely
        juliflora_count: Number(row.juliflora_count || 0),
        other_species: Number(row.other_species || 0),
        juliflora_density: Number(row.juliflora_density || 0),

        // Convert base64 safely
        image:
          row.image && typeof row.image === "string"
            ? row.image.replace(/[^A-Za-z0-9+/=]/g, "")
            : null,

        // Full clean data stored as JSON (your original approach)
        data: row,
      };

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

