const BMKG_ENDPOINT = process.env.BMKG_ENDPOINT

async function autogempa() {
    try {
        const response = await fetch(`${BMKG_ENDPOINT}/autogempa.json`);
        if (!response.ok) {
            throw new Error("Failed to fetch data from BMKG");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching earthquake data:", error);
        throw error;
    }
}

module.exports = { autogempa };