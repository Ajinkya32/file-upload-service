const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis(process.env.REDIS_URL);

const fileQueue = new Queue("fileQueue", { connection });

module.exports = { fileQueue };
