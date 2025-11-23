// components/csvUploader.js
import { supabase } from "../supabaseClient";
import Papa from "papaparse";

export async function uploadCSVToSupabase(file) {
  if (!file || !file.name.toLowerCase().endsWith(".csv")) {
    return { success: false, message: "Please upload a valid CSV file." };
  }

  try {
    const parsed = await new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: resolve,
        error: reject,
      });
    });

    const rows = parsed.data;

    if (!rows.length) {
      return { success: false, message: "CSV is empty." };
    }

    // Convert CSV rows to match Supabase schema exactly
    const formattedRows = rows.map((row) => ({
      filename: row.filename || file.name,
      date: row.date || null,
      time: row.time || null,
      coordinates: row.coordinates || null,
      district: row.district || null,
      state: row.state || null,
      taluka: row.taluka || null,
      village: row.village || null,
      grid_id: row.grid_id || null,
      gcp_id: row.gcp_id || null,
      juliflora_count: row.juliflora_count || null,
      other_species: row.other_species || null,
      juliflora_density: row.juliflora_density || null,

      // Base64 → bytea buffer
      image: row.image
        ? Buffer.from(row.image.trim(), "base64")
        : null,
    }));

    // Insert only allowed columns
    const { error } = await supabase
      .from("uploaded_csv")
      .insert(formattedRows);

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
