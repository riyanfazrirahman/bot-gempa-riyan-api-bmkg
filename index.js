import express from "express";
import { MyBot } from "./api/api-bot-telegram.js";
import { getGempaBMKG } from "./api/api-gempa.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Menggunakan `import.meta.url` untuk mendapatkan __dirname dalam ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files (index.html, favicon.ico, etc.) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Halaman utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route untuk API gempa
app.get("/api-gempa-bmkg", async (req, res) => {
  try {
    const gempaData = await getGempaBMKG();
    res.json(gempaData);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data gempa" });
  }
});

// Menjalankan server Express
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
