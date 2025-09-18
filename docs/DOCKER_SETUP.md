# Docker Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database
POSTGRES_DB=bandsyte_dev
POSTGRES_USER=bandsyte_user
POSTGRES_PASSWORD=bandsyte_password
DATABASE_URL=postgresql://bandsyte_user:bandsyte_password@localhost:5432/bandsyte_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret-here

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# AWS SES
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Development Setup

1. **Install dependencies:**

   ```bash
   npm run install-all
   ```

2. **Start Docker Desktop** (if not already running)

3. **Start development environment:**

   ```bash
   docker compose up
   ```

4. **Run database migrations:**

   ```bash
   npm run migrate:deploy
   ```

5. **Seed the database with test data:**

   ```bash
   # Seed all tenants (Bandsyte + Logan's Run)
   npm run seed:all

   # Or seed individual tenants:
   npm run seed:bandsyte
   npm run seed:logans-run
   ```

## Production Setup

1. **Build and start production environment:**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

## Database Seeders

The application includes a comprehensive seeding system located in `server/db/prisma/seeders/`:

### Available Seeders

- **Bandsyte Tenant** (`bandsyte-seeder.js`): Seeds the official Bandsyte company tenant

  - Domain: bandsyte.com
  - Admin: admin@bandsyte.com / Bandsyte!1
  - Includes: theme, bio, contact info

- **Logan's Run Tenant** (`logans-run-seeder.js`): Seeds an example band tenant
  - Domain: logansrun.bandsyte.com
  - Admin: loganjbars@gmail.com
  - Includes: theme, bio, contact info, member, merch config

### Seeder Features

- **One-time setup**: Designed for initial database setup only
- **Tenant-scoped**: Uses `withTenant` for proper data isolation
- **Comprehensive**: Seeds all required data for each tenant type
- **Modular**: Each seeder can be run independently

### ⚠️ Important Notes

- **Do not run seeders multiple times**: These seeders create tenants with unique constraints (domains, emails, etc.)
- **Run only during initial setup**: Use these seeders to set up your development environment initially
- **Reset database if needed**: If you need to re-seed, use `npm run db:reset` to clear and rebuild the database first

## Available Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Useful Commands

- **View logs**: `docker compose logs -f [service-name]`
- **Stop services**: `docker compose down`
- **Rebuild services**: `docker compose up --build`
- **Run migrations**: `npm run migrate:deploy`
- **Check migration status**: `npm run migrate:status`
- **Seed all tenants**: `npm run seed:all`
- **Seed Bandsyte tenant**: `npm run seed:bandsyte`
- **Seed Logan's Run tenant**: `npm run seed:logans-run`
- **Export database**: `npm run db:export`
- **Import database**: `npm run db:import-docker backup-file.sql`
- **Reset database**: `npm run db:reset`
