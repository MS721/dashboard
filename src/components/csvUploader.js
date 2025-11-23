// components/csvUploader.js
import { supabase } from "../supabaseClient";
import Papa from "papaparse";

export async function uploadCSVToSupabase(file) {
  if (!file || !file.name.toLowerCase().endsWith(".csv")) {
    return { success: false, message: "Please upload a valid CSV file." };
  }

  try {
    // --- FIX: add escapeChar + quoteChar for JSON inside CSV ---
    const parsed = await new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        escapeChar: '"',
        quoteChar: '"',
        complete: resolve,
        error: reject,
      });
    });

    const rows = parsed.data;
    if (!rows.length) {
      return { success: false, message: "CSV is empty." };
    }

    // Map CSV → DB columns (ignore id, uploaded_at, data)
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

      // Base64 → bytea
      image: row.image
        ? Buffer.from(
            row.image.replace(/^data:image\/\w+;base64,/, "").trim(),
            "base64"
          )
        : null,
    }));

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
