const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");

async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;

  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    const hash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, password: hash },
    });

    console.log("Admin user seeded");
  }
}

module.exports = { getUserByEmail, seedAdmin };
