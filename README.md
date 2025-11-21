# TinyURL - URL Shortener

A full-stack URL shortening application built with React, Node.js, Express, and PostgreSQL.

## Features

- Shorten long URLs into compact, shareable links
- PostgreSQL database for reliable URL storage
- Modern React frontend with TypeScript
- RESTful API backend
- Docker support for easy deployment

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

## Building for Production

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
