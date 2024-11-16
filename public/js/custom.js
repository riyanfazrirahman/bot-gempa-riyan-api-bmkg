document.getElementById("showGempaBtn").addEventListener("click", async () => {
  // Ambil data dari API /api-gempa-bmkg
  try {
    const response = await fetch("/api-gempa-bmkg");
    const data = await response.json();

    // Ambil data gempa pertama (atau sesuaikan dengan kebutuhan)
    const gempa = data.Infogempa.gempa;

    // Update konten di halaman dengan data gempa
    document.getElementById("gempaDetails").innerHTML = `
          <p>${gempa.Tanggal} | ${gempa.Jam}</p>

          <div class="contain-info ">
        <table class="tabel-gempa">
          <tr>
            <th>Magnitudo</th>
            <td>${gempa.Magnitude} SR</td>
          </tr>
          <tr>
            <th>Kedalaman</th>
            <td>${gempa.Kedalaman}</td>
          </tr>
          <tr>
            <th>Wilayah</th>
            <td>${gempa.Wilayah}</td>
          </tr>
          <tr>
            <th>Potensi</th>
            <td>${gempa.Potensi}</td>
          </tr>
        </table>
        </div>
      
        <img class="img-info-gempa" src="https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}" alt="">
    
        <p style="padding-top:40px"><strong>Sumber data:</strong> BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</p>
          
        `;

    // Tampilkan kontainer informasi gempa
    document.getElementById("gempaInfo").style.display = "block";
  } catch (error) {
    alert("Terjadi kesalahan saat mengambil data gempa.");
  }
});
