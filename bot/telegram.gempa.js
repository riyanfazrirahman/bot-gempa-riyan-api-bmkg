require("dotenv").config();

const { Telegraf } = require("telegraf");
const axios = require("axios");

const token = process.env.TELEGRAM_BOT_TOKEN;
const BASE_URL = process.env.BASE_URL;
const BMKG_ENDPOINT = process.env.BMKG_ENDPOINT;

const bot = new Telegraf(token);

// set menu command
bot.telegram.setMyCommands([
    { command: "start", description: "Mulai bot" },
    { command: "gempa", description: "Info gempa terbaru" },
]);

// Pesan Start
bot.start((ctx) => {
    const startMessage = `
Halo! Saya adalah bot informasi gempa.
Gunakan /gempa untuk mendapatkan info gempa terkini.

Bot ini menyediakan data kejadian gempa bumi yang terjadi di seluruh wilayah Indonesia, yang terdiri dari tiga jenis data kejadian gempa:

<b>1. Gempabumi M 5.0+</b> – Gempabumi dengan magnitudo 5.0 ke atas.
<b>2. Gempabumi Dirasakan</b> – Gempabumi yang dirasakan oleh masyarakat.
<b>3. Gempabumi Berpotensi Tsunami</b> – Gempabumi yang berpotensi menimbulkan tsunami.

Data yang saya gunakan berasal dari Gempabumi Terbaru yang tersedia di file <code>autogempa.json</code> milik BMKG (Badan Meteorologi, Klimatologi, dan Geofisika).
`;

    ctx.reply(
        startMessage,
        { parse_mode: "HTML" }
    );
});

// Pesan Gempa
bot.command("gempa", async (ctx) => {
    try {
        const response = await axios.get(`${BMKG_ENDPOINT}/autogempa.json`);
        const data = await response.data;

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

        const imageUrl = BMKG_ENDPOINT + Shakemap;

        const text = `
${Tanggal} | ${Jam}
Magnitude: <b>${Magnitude} SR</b>
Kedalaman: <b>${Kedalaman}</b>.
Lokasi: ${Wilayah}
Potensi: ${Potensi}

<i>Sumber data: </i>
<b>BMKG</b> <code>(Badan Meteorologi, Klimatologi, dan Geofisika)</code>
        `;

        await ctx.replyWithPhoto(imageUrl, {
            caption: text,
            parse_mode: "HTML"
        });

    } catch (err) {
        console.error(err);
        ctx.reply("Error ambil data gempa");
    }
});

// handler
bot.on('text', (ctx) => {
    const text = ctx.message.text;

    if (text.startsWith('/')) return; // skip command
    ctx.reply('Pesan diterima!');
});

module.exports = bot;