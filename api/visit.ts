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

    // Geolocation Resolution
    const ip = ((req.headers["x-forwarded-for"] as string || "").split(",")[0] || "").trim() || req.socket.remoteAddress || "";
    
    let countryCode = (req.headers["x-vercel-ip-country"] as string) || "";
    let countryName = "";
    let city = (req.headers["x-vercel-ip-city"] as string) || "";
    let latitude = parseFloat(req.headers["x-vercel-ip-latitude"] as string || "0");
    let longitude = parseFloat(req.headers["x-vercel-ip-longitude"] as string || "0");

    const countryNameMap: Record<string, string> = {
      "ID": "Indonesia",
      "US": "United States",
      "SG": "Singapore",
      "JP": "Japan",
      "GB": "United Kingdom",
      "AU": "Australia",
      "DE": "Germany",
      "FR": "France",
      "IN": "India",
      "MY": "Malaysia",
    };

    // If running locally, or Vercel headers are missing, simulate a populated map
    if (!countryCode || ip === "::1" || ip === "127.0.0.1" || ip.includes("127.0.0.1")) {
      const mockLocations = [
        { code: "ID", name: "Indonesia", city: "Jakarta", lat: -6.2088, lon: 106.8456, weight: 0.70 },
        { code: "US", name: "United States", city: "San Francisco", lat: 37.7749, lon: -122.4194, weight: 0.12 },
        { code: "SG", name: "Singapore", city: "Singapore", lat: 1.3521, lon: 103.8198, weight: 0.08 },
        { code: "JP", name: "Japan", city: "Tokyo", lat: 35.6762, lon: 139.6503, weight: 0.05 },
        { code: "GB", name: "United Kingdom", city: "London", lat: 51.5074, lon: -0.1278, weight: 0.03 },
        { code: "AU", name: "Australia", city: "Sydney", lat: -33.8688, lon: 151.2093, weight: 0.02 },
      ];

      const rand = Math.random();
      let cumulativeWeight = 0;
      let selectedLoc = mockLocations[0];
      for (const loc of mockLocations) {
        cumulativeWeight += loc.weight;
        if (rand <= cumulativeWeight) {
          selectedLoc = loc;
          break;
        }
      }

      countryCode = selectedLoc.code;
      countryName = selectedLoc.name;
      city = selectedLoc.city;
      latitude = selectedLoc.lat;
      longitude = selectedLoc.lon;
    } else {
      try {
        city = decodeURIComponent(city);
      } catch (e) {}
      countryName = countryNameMap[countryCode] || countryCode;
    }

    // SQL-like insert statement
    await db.query(
      "INSERT INTO visits (id, timestamp, dayOfWeek, userAgent, countryCode, countryName, city, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, timestamp, dayOfWeek, userAgent || "", countryCode, countryName, city, latitude, longitude]
    );

    return res.status(201).json({ success: true, visit: { id, timestamp, dayOfWeek } });
  } catch (err: any) {
    console.error("Error logging visit in API handler:", err);
    return res.status(500).json({ error: "Internal server error saving visit" });
  }
}
