// components/csvUploader.js
import { supabase } from "../supabaseClient";
import Papa from "papaparse";

export async function uploadCSVToSupabase(file) {
  // 1. Check if the file has .csv extension
  if (!file || !file.name.toLowerCase().endsWith(".csv")) {
    return { success: false, message: "Please upload a valid CSV file." };
  }

  try {
    // 2. Parse CSV flexibly
    const parsed = await new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,           // read first row as keys
        skipEmptyLines: false,  // keep empty lines, store as nulls
        dynamicTyping: true,    // try to convert numbers automatically
        complete: resolve,
        error: reject,
      });
    });

    const rows = parsed.data;

    if (!rows || rows.length === 0) {
      return { success: false, message: "CSV is empty." };
    }

    // 3. Insert all data as JSON in Supabase
    const { error } = await supabase.from("uploaded_csv").insert([
      {
        filename: file.name,
        data: rows,
      },
    ]);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return { success: false, message: "Failed to upload CSV to database." };
    }

    return { success: true, message: "CSV uploaded successfully!" };
  } catch (err) {
    console.error("CSV Parsing Error:", err);
    return { success: false, message: "Error parsing CSV file." };
  }
}
