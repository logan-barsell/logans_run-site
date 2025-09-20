# Docker Setup Guide

This guide covers both **Development** and **Production** Docker setups for the Bandsyte platform.

## 🚀 Quick Start

### Development (Recommended for daily work)

```bash
# Start development environment with hot reloading
docker compose -f docker-compose.dev.yml up --build
```

### Production (For testing production builds)

```bash
# Start production environment
docker compose -f docker-compose.prod.yml up --build
```

## 📋 Environment Setup

### 1. Create Docker Environment File

Create a `.env.docker` file in the project root:

```bash
# Database - Use local Docker PostgreSQL
DATABASE_URL=postgresql://bandsyte_user:bandsyte_password@postgres:5432/bandsyte_dev
OWNER_DATABASE_URL=postgresql://bandsyte_user:bandsyte_password@postgres:5432/bandsyte_dev

# Redis - Use local Docker Redis
REDIS_URL=redis://redis:6379

# Basic Settings
NODE_ENV=development

# URL Configuration
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5001

# JWT (required for authentication)
JWT_SECRET=your-jwt-secret-here

# Stripe
STRIPE_SECRET=sk_test_your_stripe_test_secret_key_here
STRIPE_REDIRECT_DOMAIN=http://localhost:3000
SHIPPING_RATE_ID=shr_your_shipping_rate_id_here

# Add any other variables from your local .env file...
```

### 2. Production Environment Variables

For production testing, set these environment variables:

```bash
export POSTGRES_DB=bandsyte_prod
export POSTGRES_USER=bandsyte_user
export POSTGRES_PASSWORD=your-production-password
export JWT_SECRET=your-production-jwt-secret
export FIREBASE_PROJECT_ID=your-firebase-project-id
export FIREBASE_PRIVATE_KEY=your-firebase-private-key
export FIREBASE_CLIENT_EMAIL=your-firebase-client-email
export AWS_ACCESS_KEY_ID=your-aws-access-key
export AWS_SECRET_ACCESS_KEY=your-aws-secret-key
export AWS_REGION=us-east-1
export STRIPE_SECRET_KEY=your-stripe-secret-key
export STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
export NEXT_PUBLIC_API_URL=http://localhost:5001
```

## 🛠️ Development Setup

### Features

- **Hot reloading**: Code changes reflect immediately
- **Volume mounts**: Full source code mounted for live editing
- **Development database**: Separate from production data
- **Debug-friendly**: Easy to debug and troubleshoot

### Commands

```bash
# Start development environment
docker compose -f docker-compose.dev.yml up --build

# Stop development environment
docker compose -f docker-compose.dev.yml down -v

# Restart just the web container (for quick fixes)
docker compose -f docker-compose.dev.yml restart web

# View logs
docker compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker compose -f docker-compose.dev.yml logs -f web
docker compose -f docker-compose.dev.yml logs -f api
```

### Development Services

- **Frontend**: http://localhost:3000 (with hot reloading)
- **Backend API**: http://localhost:5001
- **PostgreSQL**: localhost:5433 (avoiding local conflicts)
- **Redis**: localhost:6379

## 🏭 Production Setup

### Features

- **Optimized builds**: Production-ready Docker images
- **Standalone output**: Next.js standalone builds
- **No volume mounts**: Uses built-in code from images
- **Production database**: Separate data volumes
- **Health checks**: Automatic restart on failure

### Commands

```bash
# Start production environment
docker compose -f docker-compose.prod.yml up --build

# Stop production environment
docker compose -f docker-compose.prod.yml down -v

# Start in background
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

### Production Services

- **Frontend**: http://localhost:3000 (production build)
- **Backend API**: http://localhost:5001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🔄 Switching Between Environments

### From Development to Production

```bash
# Stop development
docker compose -f docker-compose.dev.yml down -v

# Start production
docker compose -f docker-compose.prod.yml up --build
```

### From Production to Development

```bash
# Stop production
docker compose -f docker-compose.prod.yml down -v

# Start development
docker compose -f docker-compose.dev.yml up --build
```

## 🗄️ Database Management

### Automatic Features

Both environments include:

- **Automatic migrations**: Run during container startup
- **Database readiness checks**: Wait for database before starting
- **Prisma client generation**: Built into Docker images

### Manual Database Commands

```bash
# Check migration status (in API container)
docker compose -f docker-compose.dev.yml exec api npm run migrate:status

# Run migrations manually (usually not needed)
docker compose -f docker-compose.dev.yml exec api npm run migrate:deploy

# Seed database with test data
docker compose -f docker-compose.dev.yml exec api npm run seed:all
```

### Database Seeders

Available seeders for initial setup:

- `npm run seed:bandsyte` - Official Bandsyte company tenant
- `npm run seed:logans-run` - Example band tenant
- `npm run seed:all` - Both tenants

⚠️ **Note**: Only run seeders once during initial setup. They create unique data that can't be duplicated.

## 🔧 Troubleshooting

### Port Conflicts

**PostgreSQL port 5432 already in use:**

- Development uses port 5433 to avoid conflicts
- Production uses port 5432 (standard)
- If needed, modify the port mapping in docker-compose files

**Redis port 6379 already in use:**

```bash
# Check what's using the port
lsof -i :6379

# Stop conflicting service (if Homebrew Redis)
brew services stop redis
```

### Container Issues

**Web container not connecting to API:**

- Check environment variables are set correctly
- Ensure both containers are healthy
- Restart web container: `docker compose -f docker-compose.dev.yml restart web`

**API container database connection issues:**

- Check `.env.docker` file exists and has correct DATABASE_URL
- Verify PostgreSQL container is healthy
- Check API logs: `docker compose -f docker-compose.dev.yml logs api`

### Rebuilding After Changes

**Server code changes:**

```bash
# Rebuild and restart API container
docker compose -f docker-compose.dev.yml up --build api
```

**Web code changes:**

- Development: Changes reflect automatically (hot reloading)
- Production: Rebuild required: `docker compose -f docker-compose.prod.yml up --build web`

**Dockerfile changes:**

```bash
# Full rebuild required
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up
```

## 📊 Health Checks

Both environments include health checks for all services:

```bash
# Check service status
docker compose -f docker-compose.dev.yml ps

# Check health of specific service
docker compose -f docker-compose.dev.yml exec api wget --spider -q http://localhost:5001/api/health
docker compose -f docker-compose.dev.yml exec web wget --spider -q http://localhost:3000
```

## 🎯 Best Practices

### Development Workflow

1. Use development environment for daily coding
2. Make changes and see them reflected immediately
3. Test production builds before deploying
4. Use production environment to verify deployment readiness

### Production Testing

1. Always test production builds locally before deployment
2. Verify all environment variables are set correctly
3. Check that health endpoints respond properly
4. Ensure database migrations run successfully

### Data Management

1. Use separate database volumes for dev/prod
2. Seed development database with test data
3. Never run seeders in production
4. Regular database backups before major changes

## 🚀 Deployment

When ready to deploy to production:

1. **Test production build locally:**

   ```bash
   docker compose -f docker-compose.prod.yml up --build
   ```

2. **Verify all services are healthy:**

   ```bash
   docker compose -f docker-compose.prod.yml ps
   ```

3. **Test key functionality:**

   - Frontend loads at http://localhost:3000
   - API responds at http://localhost:5001/api/health
   - Database migrations completed successfully

4. **Deploy to your production environment** using the same docker-compose.prod.yml configuration
