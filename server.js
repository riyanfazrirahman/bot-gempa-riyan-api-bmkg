require("dotenv").config({
    path: `.env.${process.env.NODE_ENV || "development"}`
});

const express = require("express");
const cors = require("cors");
const favicon = require("serve-favicon");
const path = require("path");
const { Telegraf } = require('telegraf');

// Import
const app = express();
const gempaApi = require("./routes/gempa.route");
const bot = require("./bot/telegram.gempa");

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));

/* **************************************
 * BASE API
 * **************************************/

// Root endpoint
app.get('/', (req, res) => {
    res.render("index", {
        BASE_URL: process.env.BASE_URL
    });
});

// Routes
app.use("/api/gempa", gempaApi);

/* **************************************
 * TELEGRAM BOT
 * **************************************/
if (process.env.NODE_ENV === "production") {
    // webhook
    app.use(bot.webhookCallback('/bot'));
} else {
    bot.launch(); // lokal
}

require("./bot/telegram.gempa");

/* **************************************
 * RUN SERVER
 * **************************************/
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`SERVER running on: http://localhost:${PORT}`);
});
