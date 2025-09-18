require('dotenv').config();
const { spawnSync } = require('child_process');

if (
  !process.env.OWNER_DATABASE_URL ||
  process.env.OWNER_DATABASE_URL.trim() === ''
) {
  console.error('OWNER_DATABASE_URL is not set. Please add it to your .env.');
  process.exit(1);
}

process.env.DATABASE_URL = process.env.OWNER_DATABASE_URL;

const args = process.argv.slice(2);
const result = spawnSync('npx', ['prisma', ...args], {
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status || 0);
