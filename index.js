import express from "express";
import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

dotenv.config();

// Inisialisasi bot Telegram
const app = express();
const token = process.env.TELEGRAM_BOT_TOKEN; // Token bot Telegram dari environment variable
const MyBot = new TelegramBot(token, { polling: false }); // Gunakan webhook, nonaktifkan polling

const port = process.env.PORT || 3000;
const WEBHOOK_URL = `${process.env.WEBHOOK_BASE_URL}/bot${token}`;

// Middleware untuk membaca body request sebagai JSON
app.use(express.json());

// Atur webhook ke Telegram
MyBot.setWebHook(WEBHOOK_URL, {}, (err) => {
  if (err) {
    console.error("Gagal mengatur webhook:", err);
  } else {
    console.log(`Webhook berhasil diatur di URL: ${WEBHOOK_URL}`);
  }
});

const prefix = "/";

// Menangani perintah /start
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

  MyBot.sendMessage(callback.chat.id, startMessage, { parse_mode: "HTML" });
});

// Menangani perintah /gempa
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

    MyBot.sendPhoto(callback.chat.id, BMKGImage, {
      caption: resultText,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    MyBot.sendMessage(
      callback.chat.id,
      "Terjadi kesalahan saat mendapatkan data gempa."
    );
  }
});

// Menggunakan `import.meta.url` untuk mendapatkan __dirname dalam ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files (index.html, favicon.ico, etc.) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Endpoint utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint tambahan untuk mendapatkan data gempa secara manual
app.get("/api-gempa-bmkg", async (req, res) => {
  const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/";

  try {
    const response = await fetch(`${BMKG_ENDPOINT}autogempa.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch data from BMKG");
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data gempa" });
  }
});

// Menjalankan server Express
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
  console.log(`Webhook URL: ${WEBHOOK_URL}`);
});
