import express from "express";
import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { createCanvas, loadImage } from "canvas";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

const option = {
  polling: true,
};

// Inisialisasi bot Telegram
const MyBot = new TelegramBot(token, option);

// Membuat aplikasi Express
const app = express();
const port = process.env.PORT || 3000;

const prefix = "/";
const startBot = new RegExp(`^${prefix}start$`);
const gempa = new RegExp(`^${prefix}gempa$`);

// Pesan pertama bot
MyBot.onText(startBot, (callback) => {
  const startMassages = `
Halo! Saya adalah bot informasi gempa.
Gunakan /gempa untuk mendapatkan info gempa terkini.

Bot ini menyediakan data kejadian gempa bumi yang terjadi di seluruh wilayah Indonesia, yang terdiri dari tiga jenis data kejadian gempa:

<b>1. Gempabumi M 5.0+</b> – Gempabumi dengan magnitudo 5.0 ke atas.
<b>2. Gempabumi Dirasakan</b> – Gempabumi yang dirasakan oleh masyarakat.
<b>3. Gempabumi Berpotensi Tsunami</b> – Gempabumi yang berpotensi menimbulkan tsunami.

Data yang saya gunakan berasal dari Gempabumi Terbaru yang tersedia di file <code>autogempa.json</code> milik BMKG (Badan Meteorologi, Klimatologi, dan Geofisika).
`;

  // Mengirim pesan dengan parse_mode HTML agar styling diterapkan
  MyBot.sendMessage(callback.from.id, startMassages, { parse_mode: "HTML" });
});

// Menangani permintaan /gempa untuk mendapatkan informasi gempa
MyBot.onText(gempa, async (callback) => {
  const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/";

  try {
    // Memanggil API untuk mendapatkan data gempa
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

    // Membuat URL untuk gambar Shakemap
    const BMKGImage = BMKG_ENDPOINT + Shakemap;

    // Menyusun pesan yang akan dikirim
    const resultText = `
<i>${Tanggal} | ${Jam}</i>
Besaran Gempa: <b>${Magnitude} SR</b> | Kedalaman: <b>${Kedalaman}</b>.
Lokasi: ${Wilayah}.
Potensi: ${Potensi}.
    
<i>Sumber data: </i>
<b>BMKG</b> <code>(Badan Meteorologi, Klimatologi, dan Geofisika)</code>
    `;

    // Mengirim gambar dengan caption
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

// Function to fetch and create favicon from GitHub avatar
async function createFaviconFromGitHub(username) {
  try {
    // Fetch user data from GitHub
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json(); // Get user data as JSON

    // Get the avatar URL from GitHub user data
    const avatarUrl = data.avatar_url;

    // Load the image (GitHub avatar)
    const image = await loadImage(avatarUrl); // Load image from the URL

    // Create a canvas to draw the image and convert to favicon size
    const canvas = createCanvas(64, 64); // Standard favicon size
    const ctx = canvas.getContext("2d");

    // Draw the image onto the canvas
    ctx.drawImage(image, 0, 0, 64, 64);

    // Return the canvas as a buffer in .ico format
    return canvas.toBuffer("image/x-icon");
  } catch (error) {
    console.error("Error creating favicon:", error);
    throw new Error("Could not create favicon");
  }
}

// Serve the dynamic favicon
app.get("/favicon.ico", async (req, res) => {
  try {
    const username = "riyanfazrirahman"; // Replace with your GitHub username
    const faviconBuffer = await createFaviconFromGitHub(username);
    res.setHeader("Content-Type", "image/x-icon");
    res.send(faviconBuffer);
  } catch (error) {
    res.status(500).send("Error generating favicon");
  }
});

// Halaman utama
app.get("/", (req, res) => {
  res.send(`
        <html>
          <head>
            <title>Bot Gempa</title>
             <link rel="icon" href="/favicon.ico" type="image/x-icon">
          </head>
          <body>
            <h1>Selamat datang di Bot Informasi Gempa</h1>
            <p>Gunakan <b>/gempa</b> untuk mendapatkan informasi gempa terkini.</p>
            <p>Sumber data: <a href="https://data.bmkg.go.id/gempabumi/" target="_blank">BMKG</a></p>
          </body>
        </html>
      `);
});

// Menjalankan server Express
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
