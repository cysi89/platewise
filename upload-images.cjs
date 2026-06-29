const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const imgDir = "./public/images";
const files = fs.readdirSync(imgDir).filter(f => f.match(/\.(png|jpg|jpeg)$/));

async function uploadAll() {
  console.log(`Found ${files.length} images to upload...`);
  for (const file of files) {
    const filePath = path.join(imgDir, file);
    const buffer = fs.readFileSync(filePath);
    const contentType = file.endsWith(".png") ? "image/png" : "image/jpeg";
    process.stdout.write(`Uploading ${file}... `);
    const { error } = await supabase.storage
      .from("recipe-images")
      .upload(file, buffer, { contentType, upsert: true });
    if (error) {
      console.log(`ERROR: ${error.message}`);
    } else {
      const { data } = supabase.storage.from("recipe-images").getPublicUrl(file);
      console.log(`OK`);
    }
  }
  console.log("\nAll done!");
}

uploadAll();
