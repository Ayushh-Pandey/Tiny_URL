import app from '../src/app';
import { initializeDatabase } from '../src/db/init';

let dbInitialized = false;

const handler = async (req: any, res: any) => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
      console.log('Database initialized successfully');
    } catch (error: any) {
      console.error('Database initialization failed:', error.message);
    }
  }

  return app(req, res);
};

export default handler;
