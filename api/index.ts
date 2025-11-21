import app from '../Backend/src/app';
import { initializeDatabase } from '../Backend/src/db/init';

let dbInitialized = false;

const handler = async (req: any, res: any) => {
  // Check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    return res.status(500).json({
      error: 'Server configuration error',
      message: 'Database connection not configured'
    });
  }

  // Initialize database tables on first request (cold start)
  if (!dbInitialized) {
    try {
      console.log('Initializing database...');
      await initializeDatabase();
      dbInitialized = true;
      console.log('Database initialized successfully');
    } catch (error: any) {
      console.error('Database initialization failed:', error);
      // Don't return error - let the app handle individual requests
      // Some operations might still work even if initialization fails
    }
  }

  // Pass request to Express app
  return app(req, res);
};

export default handler;
