import express from "express";
import TelegramBot from "node-telegram-bot-api";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();
const token = process.env.TELEGRAM_BOT_TOKEN;
const option = { polling: true };

// Inisialisasi bot Telegram
const MyBot = new TelegramBot(token, option);

const prefix = "/";

// Pesan pertama bot
const startBot = new RegExp(`^${prefix}start$`);
MyBot.onText(startBot, (callback) => {
  const startMessage = `
Halo! Saya adalah bot informasi gempa.
Gunakan /gempa untuk mendapatkan info gempa terkini.

Bot ini menyediakan data kejadian gempa bumi yang terjadi di seluruh wilayah Indonesia, yang terdiri dari tiga jenis data kejadian gempa:

<b>1. Gempabumi M 5.0+</b> – Gempabumi dengan magnitudo 5.0 ke atas.
<b>2. Gempabumi Dirasakan</b> – Gempabumi yang dirasakan oleh masyarakat.
<b>3. Gempabumi Berpotensi Tsunami</b> – Gempabumi yang berpotensi menimbulkan tsunami.

Data yang saya gunakan berasal dari Gempabumi Terbaru yang tersedia di file <code>autogempa.json</code> milik BMKG (Badan Meteorologi, Klimatologi, dan Geofisika).
  `;

  MyBot.sendMessage(callback.from.id, startMessage, { parse_mode: "HTML" });
});

// Menangani permintaan /gempa untuk mendapatkan informasi gempa
const gempa = new RegExp(`^${prefix}gempa$`);
MyBot.onText(gempa, async (callback) => {
  const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/";

  try {
    const apiCall = await fetch(BMKG_ENDPOINT + "autogempa.json");
    const data = await apiCall.json();

    const {
      Infogempa: {
        gempa: {
          Tanggal,
          Jam,
          Magnitude,
          Kedalaman,
          Wilayah,
          Potensi,
          Shakemap,
        },
      },
    } = data;

    const BMKGImage = BMKG_ENDPOINT + Shakemap;

    const resultText = `
<i>${Tanggal} | ${Jam}</i>
Besaran Gempa: <b>${Magnitude} SR</b> | Kedalaman: <b>${Kedalaman}</b>.
Lokasi: ${Wilayah}.
Potensi: ${Potensi}.

<i>Sumber data: </i>
<b>BMKG</b> <code>(Badan Meteorologi, Klimatologi, dan Geofisika)</code>
    `;

    MyBot.sendPhoto(callback.from.id, BMKGImage, {
      caption: resultText,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    MyBot.sendMessage(
      callback.from.id,
      "Terjadi kesalahan saat mendapatkan data gempa."
    );
  }
});

// Menggunakan `import.meta.url` untuk mendapatkan __dirname dalam ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files (index.html, favicon.ico, etc.) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Halaman utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Fungsi untuk mendapatkan data gempa dari BMKG
const getGempaBMKG = async () => {
  const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/";

  try {
    const response = await fetch(`${BMKG_ENDPOINT}autogempa.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch data from BMKG");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    throw error;
  }
};

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

let requestCount = 0; // Variabel untuk mencatat jumlah request (contoh)

app.get("/auto-reload", (req, res) => {
  requestCount++; // Simulasi data dinamis
  res.json({
    message: `Ini adalah request ke-${requestCount}`,
    timestamp: new Date().toISOString(),
  });
});

// Menjalankan server Express
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
