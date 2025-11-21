import pool from './index';

export async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(8) UNIQUE NOT NULL,
        target_url TEXT NOT NULL,
        title VARCHAR(255),
        clicks INTEGER DEFAULT 0,
        last_clicked TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS clicks (
        id SERIAL PRIMARY KEY,
        link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
        ip VARCHAR(45),
        user_agent TEXT,
        referrer TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_links_slug ON links(slug)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id)
    `);

    console.log('Database ready');
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  }
}
