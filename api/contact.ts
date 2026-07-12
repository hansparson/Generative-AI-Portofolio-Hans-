import type { VercelRequest, VercelResponse } from '@vercel/node';

// Fallback in-memory messages store inside the serverless instance container
global.contactSubmissions = global.contactSubmissions || [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const submission = {
    id: "msg_" + Math.random().toString(36).substring(2, 9),
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
  };

  // Storing messages in global variable (ephemeral memory for serverless)
  global.contactSubmissions.push(submission);

  return res.status(201).json({ success: true, submission });
}
