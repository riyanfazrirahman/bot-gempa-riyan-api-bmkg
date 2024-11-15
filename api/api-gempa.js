import fetch from "node-fetch";

// Fungsi untuk mendapatkan data gempa dari BMKG
export const getGempaBMKG = async () => {
  const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/";

  try {
    // Memanggil API BMKG untuk mendapatkan data gempa terbaru
    const response = await fetch(`${BMKG_ENDPOINT}autogempa.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch data from BMKG");
    }

    const data = await response.json();
    return data; // Mengembalikan data gempa yang diterima
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    throw error; // Menangani error dan melemparnya kembali
  }
};
