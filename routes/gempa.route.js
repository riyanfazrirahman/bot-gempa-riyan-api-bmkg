const router = require("express").Router();
const bmkgController = require("../controllers/bmkg.gempa.controller")

router.get("/", bmkgController.getGempa);

module.exports = router;
