import { supabase } from "../supabaseClient";
import Papa from "papaparse";

function cleanValue(val) {
  if (val === undefined || val === null) return null;
  let v = String(val).trim();
  v = v.replace(/^\{+|"|\}+$/g, "");
  v = v.replace(/[\u0000-\u001F]+/g, "");
  v = v.replace(/,,+/g, ",");
  v = v.replace(/\s+/g, " ");
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
        skipEmptyLines: true,
        delimiter: ";", // Updated to semicolon based on your file
        complete: resolve,
        error: reject,
      });
    });

    let rows = parsed.data;

    for (let rawRow of rows) {
      let row = {};
      Object.keys(rawRow).forEach((key) => {
        row[key] = cleanValue(rawRow[key]);
      });

      const num = (v) => (v === null || v === "" ? 0 : Number(v));

      const insertRow = {
        filename: file.name,
        "Name": row["Name"],
        "Ph no": row["Ph no"],
        "DATE OF SURVEY": row["DATE OF SURVEY"],
        "TIME OF SURVEY": row["TIME OF SURVEY"],
        "GPS COORDINATES": row["GPS COORDINATES"],
        "STATE": row["STATE"],
        "DISTRICT": row["DISTRICT"],
        "TALUKA": row["TALUKA"],
        "VILLAGE": row["VILLAGE"] || row["VILLAGES"], // Matches your CSV header 'VILLAGES'
        "GRID ID": row["GRID ID"],
        "GCP ID": row["GCP ID"],
        "JULIFLORA COUNT": num(row["JULIFLORA COUNT"]),
        "OTHER SPECIES COUNT": num(row["OTHER SPECIES COUNT"]),
        "JULIFLORA DENSITY": num(row["JULIFLORA DENSITY"]),
        
        // Multiple photos split by space (Kobo default for single column export)
        "PLANT_PHOTO": row["PLANT PHOTO"] ? row["PLANT PHOTO"].split(" ") : [],
        "ACKNOWLEDGEMENT": row["ACKNOWLEDGEMENT"],
        
        data: row,
      };

      const { error } = await supabase
        .from("biomass_collection")
        .insert(insertRow);

      if (error) console.error("Insert Error:", error);
    }

    return { success: true, message: "Database updated successfully!" };
  } catch (err) {
    return { success: false, message: "Error parsing CSV file." };
  }
}
