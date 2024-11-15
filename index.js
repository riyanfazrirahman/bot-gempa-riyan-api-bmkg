import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

const option = {
  polling: true,
};

const MyBot = new TelegramBot(token, option);

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
// Menjalankan server
console.log("Bot is running...");
