const router = require("express").Router();
const bmkg = require("../controllers/bmkg.gempa.controller")

router.get("/",
    bmkg.getGempa
);

module.exports = router;
