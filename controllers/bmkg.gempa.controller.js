const { autogempa } = require("../services/bmkg.service");

async function getGempa(req, res) {
    try {
        const gempaData = await autogempa();
        res.json(gempaData);
    } catch (error) {
        res
            .status(500)
            .json({ error: "Terjadi kesalahan saat mengambil data gempa" });
    }
}

module.exports = {
    getGempa,
};
