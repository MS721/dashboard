// components/csvUploader.js
import { supabase } from "../supabaseClient";
import Papa from "papaparse";

/**
 * Upload CSV files or a folder of CSV files to Supabase table `uploaded_csv`.
 * @param {FileList | File[]} files - Single file or multiple files
 * @returns {Object} - success status and message
 */
export async function uploadCSVToSupabase(files) {
  if (!files || files.length === 0) {
    return { success: false, message: "No files selected." };
  }

  let totalRowsInserted = 0;

  // Ensure files is an array
  const filesArray = Array.from(files);

  for (const file of filesArray) {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      console.warn(`${file.name} skipped: not a CSV file.`);
      continue;
    }

    try {
      // Parse CSV
      const parsed = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,          // first row = keys
          skipEmptyLines: true,  // skip blank rows
          dynamicTyping: true,   // convert numeric values automatically
          complete: resolve,
          error: reject,
        });
      });

      const rows = parsed.data;

      if (!rows || rows.length === 0) continue;

      // Map CSV columns to Supabase table columns
      const mappedRows = rows.map((row) => ({
        filename: file.name,
        date: row["Date"] || null,
        time: row["Time"] || null,
        coordinates: row["Coordinates"] || null,
        district: row["District"] || null,
        state: row["State"] || null,
        taluka: row["Taluka"] || null,
        village: row["Village"] || null,
        grid_id: row["Grid-id"] || null,
        gcp_id: row["GCP-id"] || null,
        juliflora_count: row["Juliflora(count)"] || null,
        other_species: row["Other Species"] || null,
        juliflora_density: row["Juliflora Density(%)"] || null,
        image: row["Image"] || null, // store image URL or filename
      }));

      // Insert rows into Supabase
      const { error } = await supabase.from("uploaded_csv").insert(mappedRows);

      if (error) {
        console.error(`Error inserting file ${file.name}:`, error);
      } else {
        totalRowsInserted += mappedRows.length;
        console.log(`Inserted ${mappedRows.length} rows from ${file.name}`);
      }

    } catch (err) {
      console.error(`Error parsing file ${file.name}:`, err);
    }
  }

  return {
    success: true,
    message: `Upload complete. Total rows inserted: ${totalRowsInserted}`,
  };
}
