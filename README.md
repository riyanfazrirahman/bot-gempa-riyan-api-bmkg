# Bot Informasi Gempa

Bot ini menyediakan informasi terkini mengenai kejadian gempa bumi di seluruh wilayah Indonesia. Menggunakan data dari **[BMKG](https://data.bmkg.go.id/gempabumi/) (Badan Meteorologi, Klimatologi, dan Geofisika)**, bot ini mengirimkan informasi gempa secara real-time melalui Telegram.

## Cara Menjalankan Bot

Perintah yang Tersedia di Telegram **[Bot Gempa - Riyan](https://t.me/tesryn_bot)**

- `/start`: Menyambut pengguna dan memberikan informasi dasar tentang bot.
- `/gempa`: Memberikan informasi terkini tentang gempa bumi yang terjadi.

Atau kunjungi Website berikut: **[WEB bot-gempa-riyan](https://bot-gempa-riyan-api-bmkg.vercel.app/)**

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
