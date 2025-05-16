require("dotenv").config();
const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const prisma = require("../prisma/client");
const fs = require("fs");
const path = require("path");

const connection = new IORedis(process.env.REDIS_URL);

const uploadDir = path.join(__dirname, "../../uploads");

const worker = new Worker(
  "fileQueue",
  async (job) => {
    if (job.name === "processFile") {
      const { fileId } = job.data;

      const record = await prisma.file.findUnique({ where: { id: fileId } });

      if (!record) throw new Error("File not found");

      await prisma.file.update({ where: { id: fileId }, data: { status: "processing" } });

      try {
        const fullPath = path.join(uploadDir, record.storageName);

        const data = fs.readFileSync(fullPath);

        const extracted = `Size: ${data.length} bytes`;

        await prisma.file.update({
          where: { id: fileId },
          data: { status: "processed", extractedData: extracted },
        });
      } catch (err) {
        await prisma.file.update({
          where: { id: fileId },
          data: { status: "failed", extractedData: err.message },
        });
      }
    }
  },
  { connection }
);

worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`Job ${job.id} failed: ${err.message}`));
