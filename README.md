# Bot Informasi Gempa

Bot ini menyediakan informasi terkini mengenai kejadian gempa bumi di seluruh wilayah Indonesia. Menggunakan data dari BMKG (Badan Meteorologi, Klimatologi, dan Geofisika), bot ini mengirimkan informasi gempa secara real-time melalui Telegram.

## Fitur

- Mendapatkan informasi tentang gempa terkini.
- Data yang digunakan berasal dari API BMKG.
- Tiga jenis data yang disediakan:
  1. Gempabumi M 5.0+ (Gempa dengan magnitudo 5.0 ke atas)
  2. Gempabumi Dirasakan (Gempa yang dirasakan oleh masyarakat)
  3. Gempabumi Berpotensi Tsunami (Gempa yang berpotensi menimbulkan tsunami)

## Teknologi yang Digunakan

- **Node.js**: Untuk menjalankan bot.
- **node-fetch**: Untuk mengambil data dari API BMKG.
- **node-telegram-bot-api**: Untuk mengintegrasikan bot dengan Telegram.
- **dotenv**: Untuk mengelola konfigurasi yang bersifat rahasia seperti token Telegram.

## Cara Menjalankan Bot

1. **Clone Repository**

   Clone repository ini ke komputer Anda:

   ```bash
   git clone https://github.com/riyanfazrirahman/bot-gempa-riyan-api-bmkg.git
   ```

2. **Instalasi Dependensi**

   Pastikan Anda sudah menginstal Node.js dan npm. Kemudian jalankan perintah berikut untuk menginstal dependensi yang diperlukan:

   ```bash
   npm install
   ```

3. **Menyiapkan Token Telegram**

   Buat bot Telegram menggunakan [BotFather]([https://web.telegram.org/a/#93372553).
   Salin token API yang diberikan dan simpan dalam file `.env` di root proyek Anda dengan format berikut:

   ```makefile
   TELEGRAM_BOT_TOKEN=<your-telegram-bot-token>
   ```

4. **Menjalankan Bot**

   Setelah mengatur token bot, jalankan bot menggunakan perintah berikut:

   ```bash
   npm start
   ```

   Bot akan mulai berjalan dan menunggu interaksi pengguna di Telegram.

## Perintah yang Tersedia

- `/start`: Menyambut pengguna dan memberikan informasi dasar tentang bot.
- `/gempa`: Memberikan informasi terkini tentang gempa bumi yang terjadi.

## Contoh Pesan

Setelah menjalankan perintah `/gempa`, bot akan mengirimkan pesan yang berisi informasi gempa, seperti:

![Gempa Shakemap](https://data.bmkg.go.id/DataMKG/TEWS/20241115213951.mmi.jpg)

```yaml

15 Nov 2024 | 21:39:51 WIB
Besaran Gempa: 3.6 SR | Kedalaman: 1 km
Lokasi: Pusat gempa berada di darat 6 km barat daya Samosir.
Potensi: Gempa ini dirasakan untuk diteruskan pada masyarakat.

Sumber data: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
```

## Penggunaan API BMKG

Bot ini menggunakan data dari **endpoint [API BMKG](https://data.bmkg.go.id/gempabumi/)**, yaitu `autogempa.json`, yang menyediakan informasi tentang gempa bumi terkini.
