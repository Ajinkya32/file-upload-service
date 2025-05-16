const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadFile, getFileById, getAllFiles } = require("../controllers/fileController");
const upload = require("../utils/multer");

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

router.get("/all", authMiddleware, getAllFiles);

router.get("/:id", authMiddleware, getFileById);

module.exports = router;
