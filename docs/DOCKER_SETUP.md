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
   npm run seed:full
   ```

## Production Setup

1. **Build and start production environment:**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

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
- **Seed development data**: `npm run seed:full`
- **Export database**: `npm run db:export`
- **Import database**: `npm run db:import-docker backup-file.sql`
- **Reset database**: `npm run db:reset`
