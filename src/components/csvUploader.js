// components/csvUploader.js
import { supabase } from "../supabaseClient";
import Papa from "papaparse";

export async function uploadCSVFolder(files) {
  try {
    const allInserts = [];

    for (const file of files) {
      if (!file.name.toLowerCase().endsWith(".csv")) continue;

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

      // Map each CSV row to Supabase table columns
      rows.forEach((row) => {
        // Convert Base64 to bytea if image exists
        let imageBuffer = null;
        if (row.image) {
          try {
            imageBuffer = Uint8Array.from(
              atob(row.image.replace(/^data:image\/\w+;base64,/, "")),
              (c) => c.charCodeAt(0)
            );
          } catch (e) {
            console.error("Base64 decode failed for image");
          }
        }

        allInserts.push({
          filename: file.name,
          date: row.date || null,
          time: row.time || null,
          coordinates: row.coordinates || null,
          district: row.district || null,
          state: row.state || null,
          taluka: row.taluka || null,
          village: row.village || null,
          grid_id: row.grid_id || null,
          gcp_id: row.gcp_id || null,
          juliflora_count: row.juliflora_count || 0,
          other_species: row.other_species || 0,
          juliflora_density: row.juliflora_density || 0,
          image: imageBuffer,

          // store full original row for debugging
          data: row,
        });
      });
    }

    if (allInserts.length === 0) {
      return { success: false, message: "No valid CSV files found in folder." };
    }

    // Insert all rows into Supabase
    const { error } = await supabase
      .from("uploaded_csv")
      .insert(allInserts);

    if (error) {
      console.error(error);
      return { success: false, message: "Error inserting data into Supabase." };
    }

    return {
      success: true,
      message: `${allInserts.length} rows uploaded successfully!`,
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "CSV upload failed." };
  }
}


