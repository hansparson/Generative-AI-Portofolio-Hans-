import type { VercelRequest, VercelResponse } from "@vercel/node";
import { VisitorDatabase } from "./visitorDb.js";

const db = new VisitorDatabase();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userAgent } = req.body;
    const now = new Date();
    
    // We compute the dayOfWeek (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = now.getDay();
    const id = "visit_" + Math.random().toString(36).substring(2, 9);
    const timestamp = now.toISOString();

    // SQL-like insert statement
    await db.query(
      "INSERT INTO visits (id, timestamp, dayOfWeek, userAgent) VALUES (?, ?, ?, ?)",
      [id, timestamp, dayOfWeek, userAgent || ""]
    );

    return res.status(201).json({ success: true, visit: { id, timestamp, dayOfWeek } });
  } catch (err: any) {
    console.error("Error logging visit in API handler:", err);
    return res.status(500).json({ error: "Internal server error saving visit" });
  }
}
