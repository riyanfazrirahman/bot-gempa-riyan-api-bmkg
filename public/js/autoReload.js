const dataElement = document.getElementById("data");

// Fungsi untuk mendapatkan data terbaru
const fetchData = async () => {
  try {
    const response = await fetch("/auto-reload");
    if (response.ok) {
      const data = await response.json();
      dataElement.innerText = `Pesan: ${data.message}\nWaktu: ${data.timestamp}`;
    } else {
      dataElement.innerText = "Gagal mendapatkan data dari server.";
    }
  } catch (error) {
    dataElement.innerText = `Terjadi kesalahan: ${error.message}`;
  }
};

// Lakukan polling setiap 1 detik
setInterval(fetchData, 1000);

// Muat data pertama kali saat halaman dibuka
fetchData();
