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
        "Name": row.Name || row.name,
        "Ph_no": row.Ph_no || row.ph_no,
        "DATE_OF_SURVEY": row.DATE_OF_SURVEY || row.date,
        "TIME_OF_SURVEY": row.TIME_OF_SURVEY || row.time,
        "GPS_COORDINATES": row.GPS_COORDINATES || row.coordinates,
        "STATE": row.STATE || row.state,
        "DISTRICT": row.DISTRICT || row.district,
        "TALUKA": row.TALUKA || row.taluka,
        "VILLAGE": row.VILLAGE || row.village,
        "GRID_ID": row.GRID_ID || row.grid_id,
        "GCP_ID": row.GCP_ID || row.gcp_id,
        "JULIFLORA_COUNT": num(row.JULIFLORA_COUNT || row.juliflora_count),
        "OTHER_SPECIES_COUNT": num(row.OTHER_SPECIES_COUNT || row.other_species),
        "JULIFLORA_DENSITY": num(row.JULIFLORA_DENSITY || row.juliflora_density),
        
        // Multiple photos split by space (Kobo default for single column export)
        "PLANT_PHOTO": row.PLANT_PHOTO ? row.PLANT_PHOTO.split(" ") : [],
        "ACKNOWLEDGEMENT": row.ACKNOWLEDGEMENT || row.acknowledgement,
        
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
