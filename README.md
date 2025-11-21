# TinyURL - URL Shortener

A full-stack URL shortening application built with React, Node.js, Express, and PostgreSQL.

## Features

- Shorten long URLs into compact, shareable links
- PostgreSQL database for reliable URL storage
- Modern React frontend with TypeScript
- RESTful API backend
- Docker support for containerized deployment
- Vercel-ready with serverless functions

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for fast development
- TailwindCSS for styling
- Axios for API calls
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL database
- Helmet for security
- CORS enabled

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL (if running locally without Docker)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <your-repository-url>
cd Tinyurl
```

2. Start all services with Docker Compose:
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- PostgreSQL: localhost:5432

### Local Development

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials

5. Run the development server:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## Deploying to Vercel

This application is optimized for deployment on Vercel with serverless backend functions.

### Prerequisites

1. A Vercel account ([sign up here](https://vercel.com))
2. A PostgreSQL database (we recommend [Neon](https://neon.tech), [Supabase](https://supabase.com), or Vercel Postgres)

### Database Setup

1. Create a PostgreSQL database (e.g., on Neon or Supabase)
2. Note down your database connection string

### Deployment Steps

1. **Push to GitHub** (if not already done):
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Environment Variables** in Vercel Dashboard:

   **Backend Variables:**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `DB_SSL`: `true` (for production databases)
   - `PORT`: `4000` (optional, for compatibility)
   - `BASE_URL`: Your Vercel domain (e.g., `https://your-app.vercel.app`)

   **Frontend Variables:**
   - `VITE_API_BASE`: `/api`
   - `VITE_BASE_URL`: `https://your-app.vercel.app`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - The frontend will be served at the root
   - API endpoints will be available at `/api/*`
   - Short link redirects will work at `/:code`

### Database Initialization

After first deployment, the database tables will be created automatically on the first API call. You can verify by:
- Visiting `/healthz` endpoint
- Creating a test short link

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update the `VITE_BASE_URL` and `BASE_URL` environment variables

## Building for Production (Local)

### Backend
```bash
cd Backend
npm run build
npm start
```

### Frontend
```bash
cd Frontend
npm run build
npm run preview
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@host:5432/database
DB_SSL=false
PORT=4000
BASE_URL=http://localhost:4000
```

## Project Structure

```
Tinyurl/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## License

ISC
