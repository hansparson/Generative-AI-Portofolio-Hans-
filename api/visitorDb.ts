import fs from "fs";
import path from "path";

export interface Visit {
  id: string;
  timestamp: string; // ISO String
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  userAgent: string;
}

// In-memory store for serverless environments
if (typeof global.visitsStore === "undefined") {
  global.visitsStore = [];
}

const VISITS_FILE = path.join(process.cwd(), "data", "visits.json");
const DB_FILE = path.join(process.cwd(), "data", "visitors.db");

// Simple interface for our SQLite wrapper
interface ISqliteWrapper {
  run(sql: string, params?: any[]): Promise<{ lastID: any; changes: number }>;
  all(sql: string, params?: any[]): Promise<any[]>;
}

export class VisitorDatabase {
  private isServerless: boolean;
  private sqliteDb: ISqliteWrapper | null = null;
  private sqliteInitialized = false;

  constructor() {
    this.isServerless = process.env.VERCEL === "1" || !!process.env.AWS_LAMBDA_FUNCTION_VERSION;
  }

  /**
   * Lazily initializes the SQLite database connection if not running in serverless.
   */
  private async initSqlite(): Promise<ISqliteWrapper | null> {
    if (this.isServerless) return null;
    if (this.sqliteInitialized) return this.sqliteDb;

    try {
      // Dynamic import of sqlite3 to prevent bundlers on Vercel from crashing
      const sqlite3Module = await import("sqlite3");
      const sqlite3 = sqlite3Module.default || sqlite3Module;
      
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const dbConnection = new sqlite3.Database(DB_FILE);
      
      // Promisified wrapper
      this.sqliteDb = {
        run(sql: string, params: any[] = []): Promise<any> {
          return new Promise((resolve, reject) => {
            dbConnection.run(sql, params, function (this: any, err) {
              if (err) return reject(err);
              resolve({ lastID: this.lastID, changes: this.changes });
            });
          });
        },
        all(sql: string, params: any[] = []): Promise<any[]> {
          return new Promise((resolve, reject) => {
            dbConnection.all(sql, params, (err, rows) => {
              if (err) return reject(err);
              resolve(rows);
            });
          });
        }
      };

      // Create table
      await this.sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS visits (
          id TEXT PRIMARY KEY,
          timestamp TEXT NOT NULL,
          dayOfWeek INTEGER NOT NULL,
          userAgent TEXT
        )
      `);
      
      console.log("SQLite Engine: Successfully connected and initialized database 'data/visitors.db'.");
      this.sqliteInitialized = true;
      return this.sqliteDb;
    } catch (err) {
      console.error("SQLite Engine: Failed to load sqlite3, falling back to JSON file storage. Error:", err);
      this.sqliteInitialized = true; // Mark as initialized so we don't spam retry
      return null;
    }
  }

  /**
   * Execute SQL query. If SQLite is active, runs true SQL. Otherwise, simulates via JSON.
   */
  public async query(sql: string, params: any[] = []): Promise<any> {
    const db = await this.initSqlite();

    if (db) {
      // Real SQLite Database Query
      const normalizedSql = sql.trim().replace(/\s+/g, " ");
      if (normalizedSql.match(/^INSERT INTO visits/i)) {
        return await db.run(sql, params);
      } else {
        return await db.all(sql, params);
      }
    } else {
      // Fallback JSON Query Engine
      return this.queryFallback(sql, params);
    }
  }

  /**
   * SQL Simulation layer for JSON / Memory fallback
   */
  private queryFallback(sql: string, params: any[] = []): any {
    const visits = this.getAllVisitsFallback();
    const normalizedSql = sql.trim().replace(/\s+/g, " ");

    // 1. INSERT INTO visits
    if (normalizedSql.match(/^INSERT INTO visits/i)) {
      const [id, timestamp, dayOfWeek, userAgent] = params;
      const newVisit: Visit = {
        id: id || "visit_" + Math.random().toString(36).substring(2, 9),
        timestamp: timestamp || new Date().toISOString(),
        dayOfWeek: typeof dayOfWeek === "number" ? dayOfWeek : new Date().getDay(),
        userAgent: userAgent || ""
      };
      visits.push(newVisit);
      this.saveVisitsFallback(visits);
      return { success: true, lastID: newVisit.id };
    }

    // 2. SELECT COUNT(*)
    if (normalizedSql.match(/SELECT COUNT\(\*\)/i)) {
      return [{ count: visits.length }];
    }

    // 3. SELECT dayOfWeek, COUNT(*) GROUP BY dayOfWeek
    if (normalizedSql.match(/GROUP BY dayOfWeek/i)) {
      const counts: Record<number, number> = {};
      for (let i = 0; i < 7; i++) {
        counts[i] = 0; // Pre-fill days 0 to 6
      }
      
      visits.forEach((v) => {
        const day = typeof v.dayOfWeek === "number" ? v.dayOfWeek : 0;
        counts[day] = (counts[day] || 0) + 1;
      });

      return Object.keys(counts).map((day) => ({
        dayOfWeek: parseInt(day, 10),
        count: counts[parseInt(day, 10)]
      }));
    }

    // 4. SELECT * FROM visits ORDER BY timestamp DESC LIMIT X
    if (normalizedSql.match(/ORDER BY timestamp DESC/i)) {
      const limitMatch = normalizedSql.match(/LIMIT\s+(\d+)/i);
      const limit = limitMatch ? parseInt(limitMatch[1], 10) : visits.length;
      
      const sorted = [...visits].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      return sorted.slice(0, limit);
    }

    return visits;
  }

  private getAllVisitsFallback(): Visit[] {
    if (this.isServerless) {
      return global.visitsStore || [];
    }

    try {
      if (fs.existsSync(VISITS_FILE)) {
        const data = fs.readFileSync(VISITS_FILE, "utf-8");
        return JSON.parse(data);
      }
    } catch (err) {
      console.error("Error reading visits JSON fallback file:", err);
    }
    return global.visitsStore || [];
  }

  private saveVisitsFallback(visits: Visit[]) {
    global.visitsStore = visits;

    if (this.isServerless) {
      return;
    }

    try {
      const dir = path.dirname(VISITS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(VISITS_FILE, JSON.stringify(visits, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving visits JSON fallback file:", err);
    }
  }
}
