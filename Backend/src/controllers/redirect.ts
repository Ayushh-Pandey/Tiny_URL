import { Request, Response } from 'express';
import pool from '../db';

export const redirectHandler = async (req: Request, res: Response) => {
  const code = String(req.params.code);

  if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
    return res.status(404).send('Not found');
  }

  try {
    const result = await pool.query('SELECT id, target_url FROM links WHERE slug = $1', [code]);

    if (!result.rowCount) {
      return res.status(404).send('Not found');
    }

    const link = result.rows[0];

    // Track click and update count - MUST await in serverless environment
    try {
      await Promise.all([
        pool.query('INSERT INTO clicks (link_id, ip, user_agent, referrer) VALUES ($1,$2,$3,$4)', [
          link.id,
          req.ip,
          req.headers['user-agent'] || null,
          req.get('referer') || null
        ]),
        pool.query('UPDATE links SET clicks = clicks + 1, last_clicked = now() WHERE id = $1', [link.id])
      ]);
    } catch (trackError) {
      // Log error but still redirect - don't fail the redirect if tracking fails
      console.error('Click tracking error:', trackError);
    }

    // Perform 302 redirect
    res.redirect(302, link.target_url);
  } catch (err) {
    console.error('Redirect error:', err);
    res.status(500).send('Server error');
  }
};
