// scripts/create-tenant.js
// Usage: node scripts/create-tenant.js
require('dotenv').config();
const { prisma } = require('../db/prisma');
const { v4: uuidv4 } = require('uuid');

async function main() {
  let id = process.env.DEV_TENANT_ID;
  if (!id) {
    id = uuidv4();
    console.log('No DEV_TENANT_ID set. Generated new tenantId:', id);
    console.log('Add this to your .env as DEV_TENANT_ID=');
  }
  const name = 'Dev Tenant';
  const slug = 'dev-tenant';

  const tenant = await prisma.tenant.upsert({
    where: { id },
    update: {},
    create: { id, name, slug },
  });

  console.log('Tenant created or found:', tenant);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
