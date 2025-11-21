import { Pool } from 'pg';
const dotenv = require('dotenv');
dotenv.config();
// Validate that DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
}

// Initialize database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  // max: 10, // maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Set search path for all queries (done lazily, not on module import)
pool.on('connect', (client) => {
  client.query('SET search_path TO public').catch((err) => {
    console.error('Error setting search path:', err);
  });
});

// Log connection errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export default pool;
