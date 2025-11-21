import app from './app';
import { initializeDatabase } from './db/init';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  initializeDatabase()
    .then(() => {
      console.log('Database initialized successfully');
    })
    .catch((error) => {
      console.error('Database initialization failed:', error.message);
      console.error('Server is running but database operations will fail');
    });
});
