async function loadGempa() {
  try {
    const response = await fetch("/api/gempa");
    const data = await response.json();

    const gempa = data.Infogempa.gempa;

    document.getElementById("gempaDetails").innerHTML = `
      <p>${gempa.Tanggal} | ${gempa.Jam}</p>

      <div class="contain-info">
        <table class="tabel-gempa">
          <tr><th>Magnitudo</th><td>${gempa.Magnitude} SR</td></tr>
          <tr><th>Kedalaman</th><td>${gempa.Kedalaman}</td></tr>
          <tr><th>Wilayah</th><td>${gempa.Wilayah}</td></tr>
          <tr><th>Potensi</th><td>${gempa.Potensi}</td></tr>
        </table>
      </div>

      <img class="img-info-gempa" src="https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}">

      <p style="padding-top:40px">
        <strong>Sumber data:</strong> BMKG
      </p>
    `;

    document.getElementById("gempaInfo").style.display = "block";
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", loadGempa);