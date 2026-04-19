const { autogempa } = require("../services/bmkg.service");

async function getGempa(req, res) {
    try {
        const gempaData = await autogempa();
        res.json(gempaData);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ error: "Terjadi kesalahan saat mengambil data gempa" });
    }
}

module.exports = {
    getGempa,
};
