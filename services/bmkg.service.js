const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS";

async function autogempa() {
    try {
        const response = await fetch(`${BMKG_ENDPOINT}/autogempa.json`);
        if (!response.ok) {
            throw new Error("Failed to fetch data from BMKG");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching earthquake data:", error);
        throw error;
    }
}

module.exports = { autogempa };