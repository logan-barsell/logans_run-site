const { prisma } = require('../prisma');
const logger = require('../utils/logger');

async function withTenant(tenantId, fn, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await prisma.$transaction(async tx => {
        await tx.$executeRawUnsafe(
          `SELECT set_config('app.tenant_id', '${tenantId}', true)`
        );
        return fn(tx);
      });
    } catch (error) {
      if (error.code === 'P2028' && attempt < retries) {
        // Transaction timeout - retry with exponential backoff
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        logger.warn(
          `Transaction timeout (attempt ${attempt}/${retries}), retrying in ${delay}ms...`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

module.exports = { withTenant };
