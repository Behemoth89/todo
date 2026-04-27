# Quickstart: Family Chores Todo App

## Prerequisites

- Node.js 20.x
- Python 3.11+
- npm or yarn

## Setup

1. **Clone and install dependencies**:
   ```bash
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && pip install -r requirements.txt
   ```

2. **Initialize database**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database URL
   npx prisma migrate dev --name init
   ```

3. **Seed initial data** (optional):
   ```bash
   python -m seed
   ```

## Running the App

### Development

```bash
# Terminal 1: Start backend
cd backend
uvicorn src.main:app --reload --port 8000

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Production

```bash
# Build frontend
cd frontend && npm run build

# Start backend (serves static files)
cd backend && uvicorn src.main:app --host 0.0.0.0 --port 8000
```

## Default Access

After seeding, you can log in with:
- **Username**: `mom`
- **Password**: `password123`

## Project Structure

```
backend/
├── src/
│   ├── api/          # FastAPI routes
│   ├── models/       # Prisma schemas
│   ├── services/     # Business logic
│   └── main.py       # App entry point
└── prisma/
    └── schema.prisma # Database schema

frontend/
├── src/
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── services/     # API client
│   └── hooks/        # Custom hooks
└── index.html
```

## Key Features

- **Todo Management**: Create, edit, delete todos with priority, location, dates
- **Family Assignment**: Assign todos to one or more family members
- **Photo Attachments**: Add photos to todos (converted to WebP)
- **Parent Dependencies**: Block todos until parent is complete
- **Shopping Lists**: Add shopping items to todos, mark as bought
- **Aggregate View**: See all shopping items across all todos
- **Ready to Execute**: Automatic status based on shopping items and parent completion
- **Settings**: Configure locations, priorities without code changes