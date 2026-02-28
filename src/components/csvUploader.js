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
        delimiter: ";", 
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

      // This object keys match your Supabase SQL column names exactly
      const insertRow = {
        filename: file.name,
        name: row["Name"],
        ph_no: row["Ph no"],
        date_of_survey: row["DATE OF SURVEY"],
        time_of_survey: row["TIME OF SURVEY"],
        gps_coordinates: row["GPS COORDINATES"],
        state: row["STATE"],
        district: row["DISTRICT"],
        taluka: row["TALUKA"],
        village: row["VILLAGES"] || row["VILLAGE"], // Handle both singular and plural from CSV
        grid_id: row["GRID ID"],
        gcp_id: row["GCP ID"],
        juliflora_count: num(row["JULIFLORA COUNT"]),
        other_species_count: num(row["OTHER SPECIES COUNT"]),
        juliflora_density: num(row["JULIFLORA DENSITY"]),
        // Converting string of photos to a JSON array for your JSONB column
        plant_photo: row["PLANT PHOTO"] ? row["PLANT PHOTO"].split(" ") : [],
        acknowledgement: row["ACKNOWLEDGEMENT"],
        data: row, // Stores the full raw row as requested
      };

      const { error } = await supabase
        .from("biomass_collection")
        .insert(insertRow);

      if (error) {
        console.error("Supabase Insert Error:", error.message);
      }
    }

    return { success: true, message: "Database updated successfully!" };
  } catch (err) {
    console.error("Uploader logic error:", err);
    return { success: false, message: "Error processing CSV file." };
  }
}
