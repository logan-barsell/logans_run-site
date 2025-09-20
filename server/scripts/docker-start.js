#!/usr/bin/env node

const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function waitForDatabase() {
  console.log('🔄 Waiting for database to be ready...');

  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    try {
      await prisma.$connect();
      console.log('✅ Database connection established');
      break;
    } catch (error) {
      attempts++;
      console.log(
        `⏳ Attempt ${attempts}/${maxAttempts}: Database not ready yet...`
      );

      if (attempts >= maxAttempts) {
        console.error(
          '❌ Failed to connect to database after',
          maxAttempts,
          'attempts'
        );
        process.exit(1);
      }

      // Wait 2 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    execSync('npm run migrate:deploy', { stdio: 'inherit' });
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    // Don't exit - the app might still work with existing schema
  }
}

async function startServer() {
  try {
    console.log('🚀 Starting server...');
    execSync('node server.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
}

async function main() {
  try {
    await waitForDatabase();
    await runMigrations();
    await prisma.$disconnect();
    await startServer();
  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  }
}

main();
