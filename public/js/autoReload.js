const dataElement = document.getElementById("data");

// Fungsi untuk mendapatkan data terbaru
const fetchData = async () => {
  try {
    const response = await fetch("/auto-reload");
    if (response.ok) {
      const data = await response.json();

      // Format waktu dengan toLocaleString
      const date = new Date(data.timestamp);
      const formattedDate = date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Ambil jam, menit, dan detik dengan padStart untuk memastikan format 2 digit
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const formattedTime = `${hours}:${minutes}:${seconds}`;

      // Gabungkan tanggal dan waktu
      dataElement.innerText = `${formattedDate}\nPukul ${formattedTime}`;

      dataElement.classList.remove("error");
    } else {
      dataElement.innerText = "Gagal mendapatkan data dari server.";
      dataElement.classList.add("error");
    }
  } catch (error) {
    dataElement.innerText = `Terjadi kesalahan: ${error.message}`;
    dataElement.classList.add("error");
  }
};

// Lakukan polling setiap 1 detik
setInterval(fetchData, 1000);

// Muat data pertama kali saat halaman dibuka
fetchData();
