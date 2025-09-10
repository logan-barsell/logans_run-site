const { prisma } = require('../prisma');

module.exports = async function tenantResolver(req, res, next) {
  try {
    const host = (req.headers.host || '').toLowerCase().split(':')[0];
    let tenantId = null;

    // 1. Dev mode: localhost
    if (host === 'localhost' || host === '127.0.0.1') {
      tenantId = process.env.DEV_TENANT_ID || req.headers['x-tenant-id'];
      if (tenantId) {
        req.tenantId = tenantId;
        return next();
      }
    }

    // 2. Custom domain
    const domain = await prisma.tenantDomain.findUnique({
      where: { domain: host },
    });
    if (domain) {
      tenantId = domain.tenantId;
    }

    // 3. Subdomain: <slug>.bandsyte.com
    if (!tenantId && host.endsWith('.bandsyte.com')) {
      const sub = host.replace('.bandsyte.com', '');
      const tenant = await prisma.tenant.findUnique({ where: { slug: sub } });
      if (tenant) tenantId = tenant.id;
    }

    // 4. Admin override
    if (!tenantId && req.headers['x-tenant-id']) {
      tenantId = String(req.headers['x-tenant-id']);
    }

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant not resolved' });
    }
    req.tenantId = tenantId;
    next();
  } catch (err) {
    next(err);
  }
};
