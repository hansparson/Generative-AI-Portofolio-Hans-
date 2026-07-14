import type { VercelRequest, VercelResponse } from "@vercel/node";
import { VisitorDatabase } from "./visitorDb.js";

const db = new VisitorDatabase();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1. Get total counts
    const countRes = await db.query("SELECT COUNT(*) as count FROM visits");
    const totalVisits = countRes[0]?.count || 0;

    // 2. Get counts grouped by day of week
    const groupRes = await db.query("SELECT dayOfWeek, COUNT(*) as count FROM visits GROUP BY dayOfWeek");

    // Map results to standard structure (0-6)
    const daysNameIndo = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const daysNameEng = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const visitsByDay = Array.from({ length: 7 }, (_, i) => {
      const match = groupRes.find((g: any) => g.dayOfWeek === i);
      const count = match ? match.count : 0;
      const percentage = totalVisits > 0 ? parseFloat(((count / totalVisits) * 100).toFixed(1)) : 0;
      return {
        dayOfWeek: i,
        dayNameIndo: daysNameIndo[i],
        dayNameEng: daysNameEng[i],
        count,
        percentage
      };
    });

    // 3. Get recent 5 visits
    const recentVisits = await db.query("SELECT * FROM visits ORDER BY timestamp DESC LIMIT 5");

    // 4. Get counts grouped by country
    const countryRes = await db.query(
      "SELECT countryCode, countryName, COUNT(*) as count FROM visits GROUP BY countryCode, countryName ORDER BY count DESC"
    );
    
    const visitsByCountry = countryRes.map((c: any) => {
      const count = c.count;
      const percentage = totalVisits > 0 ? parseFloat(((count / totalVisits) * 100).toFixed(1)) : 0;
      return {
        countryCode: c.countryCode || "Unknown",
        countryName: c.countryName || (c.countryCode === "ID" ? "Indonesia" : "Unknown"),
        count,
        percentage
      };
    });

    // 5. Get coordinates of recent visits for the map (limit to 150)
    const visitorLocations = await db.query(
      "SELECT id, countryCode, countryName, city, latitude, longitude, timestamp FROM visits WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND latitude != 0 AND longitude != 0 ORDER BY timestamp DESC LIMIT 150"
    );

    return res.json({
      totalVisits,
      visitsByDay,
      recentVisits,
      visitsByCountry,
      visitorLocations
    });
  } catch (err: any) {
    console.error("Error retrieving visits in API handler:", err);
    return res.status(500).json({ error: "Internal server error retrieving statistics" });
  }
}
