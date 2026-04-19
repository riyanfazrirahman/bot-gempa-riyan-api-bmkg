const axios = require("axios");

const BMKG_ENDPOINT = process.env.BMKG_ENDPOINT

async function autogempa() {
    try {
        const response = await axios.get(`${BMKG_ENDPOINT}/autogempa.json`);
        return response.data;
    } catch (error) {
        console.error("Error fetching earthquake data:", error);
        throw error;
    }
}

module.exports = { autogempa };