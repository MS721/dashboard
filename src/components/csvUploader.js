import { supabase } from "../supabaseClient";
import Papa from "papaparse";

export async function uploadCSVToSupabase(file) {
  if (!file || !file.name.toLowerCase().endsWith(".csv")) {
    return { success: false, message: "Please upload a valid CSV file." };
  }

  try {
    // Parse CSV
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

    if (!rows || rows.length === 0) {
      return { success: false, message: "CSV is empty." };
    }

    // Normalize CSV keys (lowercase + underscores)
    const normalize = (obj) => {
      const fixed = {};
      for (const key in obj) {
        const clean = key.toLowerCase().trim().replace(/\s+/g, "_");
        fixed[clean] = obj[key];
      }
      return fixed;
    };

    // Convert CSV rows → DB rows
    const formattedRows = rows.map(original => {
      const r = normalize(original);

      return {
        filename: file.name,
        data: original,   

        date: r.date || null,
        time: r.time || null,
        coordinates: r.coordinates || null,
        district: r.district || null,
        state: r.state || null,
        taluka: r.taluka || null,
        village: r.village || null,

        grid_id: r.grid_id || null,
        gcp_id: r.gcp_id || null,

        juliflora_count: r.juliflora_count || null,
        other_species: r.other_species || null,
        juliflora_density: r.juliflora_density || null,

        image: null
      };
    });

    // Insert all rows into Supabase
    const { error } = await supabase
      .from("uploaded_csv")
      .insert(formattedRows);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return { success: false, message: "Failed to insert rows." };
    }

    return {
      success: true,
      message: `Upload complete. Total rows inserted: ${formattedRows.length}`
    };

  } catch (err) {
    console.error("CSV Parsing Error:", err);
    return { success: false, message: "Error parsing CSV file." };
  }
}

