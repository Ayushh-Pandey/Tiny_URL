import { Request, Response } from 'express';
import pool from '../db';
import { generateSlug } from '../utils/slug';
import { isValidUrl, isValidCode } from '../utils/validators';

export const createLink = async (req: Request, res: Response) => {
  const { target_url, customCode, title } = req.body;

  if (!target_url || !isValidUrl(String(target_url))) {
    return res.status(400).json({ error: 'Valid target_url with protocol required (https://...)' });
  }

  let slug = customCode ? String(customCode).trim() : generateSlug(6);

  if (customCode && !isValidCode(slug)) {
    return res.status(400).json({ error: 'Custom code must match [A-Za-z0-9]{6,8}' });
  }

  const query = `INSERT INTO links (slug, target_url, title) VALUES ($1,$2,$3) RETURNING slug, target_url, title, clicks, last_clicked, created_at`;

  if (customCode) {
    try {
      const result = await pool.query(query, [slug, target_url, title || null]);
      return res.status(201).json(result.rows[0]);
    } catch (e: any) {
      if (e.code === '23505') {
        return res.status(409).json({ error: 'Code already exists' });
      }
      return res.status(500).json({ error: 'Server error' });
    }
  }

  for (let i = 0; i < 5; i++) {
    try {
      const result = await pool.query(query, [slug, target_url, title || null]);
      return res.status(201).json(result.rows[0]);
    } catch (e: any) {
      if (e.code === '23505') {
        slug = generateSlug(i >= 2 ? 7 : 6);
        continue;
      }
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(500).json({ error: 'Could not generate unique code' });
};

export const listLinks = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT slug, target_url, title, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error listing links:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getLinkStats = async (req: Request, res: Response) => {
  const code = String(req.params.code);
  if (!isValidCode(code)) {
    return res.status(400).json({ error: 'Invalid code format' });
  }

  try {
    const result = await pool.query(
      `SELECT id, slug, target_url, title, clicks, last_clicked, created_at FROM links WHERE slug = $1`,
      [code]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: 'Not found' });
    }

    const link = result.rows[0];
    const clicks = await pool.query(
      `SELECT created_at, ip, user_agent, referrer FROM clicks WHERE link_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [link.id]
    );

    res.json({
      slug: link.slug,
      target_url: link.target_url,
      title: link.title,
      clicks: link.clicks,
      last_clicked: link.last_clicked,
      created_at: link.created_at,
      recent_clicks: clicks.rows
    });
  } catch (err) {
    console.error('Error getting link stats:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteLink = async (req: Request, res: Response) => {
  const code = String(req.params.code);
  if (!isValidCode(code)) {
    return res.status(400).json({ error: 'Invalid code format' });
  }

  try {
    const result = await pool.query(`DELETE FROM links WHERE slug = $1 RETURNING slug`, [code]);

    if (!result.rowCount) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting link:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
