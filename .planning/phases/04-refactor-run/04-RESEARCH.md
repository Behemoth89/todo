# Phase 4: Refactor and Run - Research

**Phase:** 04-refactor-run
**Mode:** ecosystem
**Status:** Research complete

## Standard Stack

### Backend (Next.js + Prisma)

| Component | Recommendation |
|-----------|-------------|
| Base image | `node:20-alpine` (LTS) |
| Package manager | npm with `--frozen-lockfile` |
| Build output | `standalone` mode in next.config.js |
| Dockerfile | Multi-stage (deps → builder → runner) |
| Prisma | `npx prisma generate` in deps stage |
| Port | 3000 (default) |

### Frontend (Vue + Vuetify + Vite)

| Component | Recommendation |
|-----------|-------------|
| Base image | `node:20-alpine` (builder), `nginx:alpine` (runner) |
| Build tool | Vite (`vite build`) |
| Dockerfile | Two-stage (builder → nginx) |
| Static server | Nginx Alpine |
| SPA routing | nginx.conf with fallback to index.html |
| Port | 80 or 8080 (non-root) |

### Docker Compose

| Service | Image | Purpose |
|--------|-------|---------|
| backend | Build from Dockerfile | Next.js API |
| frontend | Build from Dockerfile | Vue SPA |
| postgres | postgres:15-alpine | Database |
| (optional) nginx-proxy | nginx:alpine | Reverse proxy |

---

## Architecture Patterns

### Project Structure After Restructure

```
/
├── backend/           # Moved from /src
│   ├── Dockerfile
│   ├── prisma/
│   ├── src/app/
│   └── package.json
├── frontend/          # Existing Vue app
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── src/
│   └── package.json
├── docker-compose.yml
├── .env              # Shared environment
└── .gitignore
```

### Multi-Stage Dockerfile (Next.js)

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY prisma ./prisma
RUN npx prisma generate

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./next
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["npm", "start"]
```

### Multi-Stage Dockerfile (Vue + Vite)

```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runner
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration (SPA Fallback)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    gzip on;
    gzip_types text/plain text/css application/javascript;
}
```

---

## Don't Hand-Roll

1. **Database migrations in Docker** — Use `prisma migrate deploy` in startup, not `db:push`
2. **Environment variable handling** — Use docker-compose `env_file` or build args, not hardcode
3. **Node_modules in final image** — Always use multi-stage to exclude dev dependencies
4. **Static file serving** — Use Nginx (or similar), not Node.js for Vue frontend
5. **Health checks** — Add `HEALTHCHECK` in docker-compose for all services
6. **Volume permissions** — Set correct `chown` for non-root users in Dockerfile

---

## Common Pitfalls

### Backend (Next.js + Prisma)

| Pitfall | Solution |
|---------|----------|
| Prisma client not found | Run `npx prisma generate` in deps stage, copy `/app/node_modules/.prisma` |
| NEXT_PUBLIC_ vars not replaced | Use `--build-arg` at build time, or entrypoint script |
| Build-time DB connection | Pass `ARG DATABASE_URL` for build, use runtime env for run |
| Image too large (>500MB) | Enable `output: "standalone"` in next.config.js |
| Migration failures | Use `prisma migrate deploy`, not `db:push` in production |

### Frontend (Vue + Vite)

| Pitfall | Solution |
|---------|----------|
| SPA routing 404 | Nginx `try_files $uri $uri/ /index.html` |
| API calls fail in container | Set `VITE_API_URL` to container service name |
| Port 80 permission denied | Use port 8080 or configure nginx for non-root |
| Large image size | Use nginx:alpine, not node for serving |
| Cache headers missing | Add gzip and expires in nginx.conf |

### Docker Compose

| Pitfall | Solution |
|---------|----------|
| Database not ready | Add `depends_on` with condition, healthcheck on postgres |
| Port conflicts | Change ports in docker-compose.yml |
| ENV file not loading | Use `env_file:` directive (single file) or `-e` for multiple |
| Volume data loss | Use named volumes with `volumes:` directive |
| Network isolation | Define explicit network, don't use default |

---

## Code Examples

### Backend next.config.js (Standalone)

```javascript
module.exports = {
  output: 'standalone',
}
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/db
      - NODE_ENV=production
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - app-network

  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    environment:
      - VITE_API_URL=http://backend:3000
    depends_on:
      - backend
    networks:
      - app-network

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d db"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### Root .gitignore

```
node_modules/
.env*
.next/
dist/
.DS_Store
*.log
```

### Backend .gitignore (additional)

```
.prisma/
coverage/
```

### Frontend .gitignore (additional)

```
dist/
eslint.cache/
```

---

## Key Insights

1. **Multi-stage builds are standard** — Both backend and frontend benefit from separating build from runtime
2. **Standalone mode for Next.js** — Dramatically reduces image size (~150-300MB vs 1GB+)
3. **Nginx for Vue SPA** — Best practice: smaller image, proper SPA fallback, caching headers
4. **Health checks essential** — Both postgres and app should have health checks in compose
5. **Non-root users** — Run containers as non-root for security (USER directive)
6. **SPA routing in Nginx** — Critical for Vue router to work: `try_files $uri $uri/ /index.html`
7. **Dockerfile.dev vs Dockerfile.prod** — Consider separate for dev (hot reload) vs prod

---

## Confidence Levels

| Area | Confidence | Notes |
|------|------------|-------|
| Next.js Dockerfile | HIGH | Standard pattern, well-documented |
| Prisma in Docker | HIGH | Multiple sources confirm approach |
| Vue + Vite Dockerfile | HIGH | Standard SPA pattern |
| Nginx SPA config | HIGH | Well-established |
| Docker Compose | HIGH | Standard orchestration |
| .gitignore | HIGH | Standard patterns |

---

## Sources

- makerkit.dev — Next.js Prisma Docker production
- github.com/nemanjam/nextjs-prisma-boilerplate — Production Dockerfile examples
- docker.recipes — Next.js PostgreSQL Docker Compose
- docker.com/guides/vuejs — Vue.js containerize guide
- docker.com/guides/vuejs — Vue.js containerization
- vite.dev — Vite production builds
- codezup.com — Vue 3 + Docker production

---

*Research complete: 2026-04-29*