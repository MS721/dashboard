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
        delimiter: ";", // Semicolon matches your Kobo export
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

      // MAPPING: Database Key (Left) : CSV Header (Right)
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
        village: row["VILLAGE"] || row["VILLAGES"], 
        grid_id: row["GRID ID"],
        gcp_id: row["GCP ID"],
        juliflora_count: num(row["JULIFLORA COUNT"]),
        other_species_count: num(row["OTHER SPECIES COUNT"]),
        juliflora_density: num(row["JULIFLORA DENSITY"]),
        plant_photo: row["PLANT PHOTO"] ? row["PLANT PHOTO"].split(" ") : [],
        acknowledgement: row["ACKNOWLEDGEMENT"],
        data: row, // Stores raw row for backup
      };

      const { error } = await supabase
        .from("biomass_collection")
        .insert(insertRow);

      if (error) {
        console.error("Insert Error details:", error);
      }
    }

    return { success: true, message: "Database updated successfully!" };
  } catch (err) {
    console.error("Uploader Error:", err);
    return { success: false, message: "Error parsing CSV file." };
  }
}
