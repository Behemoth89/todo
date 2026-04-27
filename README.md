# Family Chores Todo App

A responsive SPA web application for managing household chores with family member assignment, photo attachments, parent-child dependencies, and integrated shopping lists.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Python FastAPI
- **Database**: SQLite (dev) / PostgreSQL (prod) via Prisma ORM
- **Authentication**: JWT-based with bcrypt password hashing
- **Image Processing**: PIL/Pillow for WebP conversion

## Quick Start

### Prerequisites

- Node.js 20.x
- Python 3.11+
- npm or yarn

### Setup

```bash
# Clone and install dependencies
cd frontend && npm install
cd ../backend && pip install -r requirements.txt

# Initialize database
cd backend
cp .env.example .env
npx prisma migrate dev --name init

# Seed initial data
python -m prisma.seed

# Start development servers
# Terminal 1: Backend
cd backend && uvicorn src.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Default Login

- **Username**: mom
- **Password**: password123

## Features

- Todo CRUD with all fields (title, priority, location, dates, notes)
- Family member assignment (multiple assignees per todo)
- Photo attachments (max 10MB, converted to WebP)
- Parent-child dependencies (blocking)
- Shopping items with "mark as bought"
- Aggregate shopping list view
- "Ready to execute" status
- Configurable locations and priorities

## Project Structure

```
backend/
├── src/
│   ├── api/          # FastAPI routes
│   ├── middleware/    # Auth, timing middleware
│   ├── utils/        # Config, errors, auth, validators
│   └── main.py       # App entry point
└── prisma/
    └── schema.prisma  # Database schema

frontend/
├── src/
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── services/     # API client
│   ├── hooks/        # Custom hooks
│   ├── types/        # TypeScript types
│   └── utils/        # Analytics, logging
└── package.json
```

## API Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET/POST /api/todos` - List/create todos
- `GET/PUT/DELETE /api/todos/:id` - Todo CRUD
- `GET/POST/PUT/DELETE /api/settings` - Settings management
- `GET/POST/PUT/DELETE /api/users` - User management
- `GET/POST /api/todos/:id/shopping-items` - Shopping items
- `GET /api/shopping-list` - Aggregate shopping list
- `POST/DELETE /api/photos` - Photo management

## License

MIT