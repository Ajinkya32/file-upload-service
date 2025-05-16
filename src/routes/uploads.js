const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const path = require("path");

const router = express.Router();

router.get("*", authMiddleware, express.static(path.join(__dirname, "../../uploads")));

module.exports = router;
