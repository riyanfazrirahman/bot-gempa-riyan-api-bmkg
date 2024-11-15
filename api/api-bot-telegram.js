import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
import { getGempaBMKG } from "./api-gempa.js";
import dotenv from "dotenv";

// Memuat file .env
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

export { MyBot };
