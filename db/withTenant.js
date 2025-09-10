const { prisma } = require('../prisma');

async function withTenant(tenantId, fn) {
  return await prisma.$transaction(async tx => {
    await tx.$executeRawUnsafe(
      `SELECT set_config('app.tenant_id', '${tenantId}', true)`
    );
    return fn(tx);
  });
}

module.exports = { withTenant };
