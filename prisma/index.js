const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  transactionOptions: {
    maxWait: 10000, // 10 seconds
    timeout: 20000, // 20 seconds
  },
});
module.exports = { prisma };
