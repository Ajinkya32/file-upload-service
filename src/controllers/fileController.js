const prisma = require("../prisma/client");
const { fileQueue } = require("../queue/fileQueue");
const path = require("path");

async function uploadFile(req, res, next) {
  try {
    const file = req.file;

    const { title, description } = req.body;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const record = await prisma.file.create({
      data: {
        userId: req.user.id,
        originalName: file.originalname,
        storageName: path.basename(file.path),
        storagePath: `/uploads/${path.basename(file.path)}`,
        title,
        description,
        status: "uploaded",
      },
    });

    await fileQueue.add("processFile", { fileId: record.id });

    return res.status(200).json({ fileId: record.id, status: record.status });
  } catch (error) {
    console.error("Error uploading file:", error);
    next(error);
  }
}

async function getFileById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    const userId = req.user.id;

    const record = await prisma.file.findFirst({ where: { id, userId } });

    if (!record) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).json(record);
  } catch (error) {
    console.error("Error fetching file:", error);
    next(error);
  }
}

async function getAllFiles(req, res, next) {
  try {
    const userId = req.user.id;

    const record = await prisma.file.findMany({ where: { userId } });

    if (!record || record.length === 0) {
      return res.status(404).json({ message: "Files not found" });
    }

    return res.status(200).json(record);
  } catch (error) {
    console.error("Error fetching files:", error);
    next(error);
  }
}

module.exports = { uploadFile, getFileById, getAllFiles };
