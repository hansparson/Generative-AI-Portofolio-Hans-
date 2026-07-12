import type { VercelRequest, VercelResponse } from '@vercel/node';

global.contactSubmissions = global.contactSubmissions || [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.json(global.contactSubmissions);
}
