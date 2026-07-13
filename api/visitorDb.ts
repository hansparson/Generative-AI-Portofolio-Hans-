import fs from "fs";
import path from "path";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export interface Visit {
  id: string;
  timestamp: string; // ISO String
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  userAgent: string;
}

// In-memory store for serverless environments (fallback)
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
  private useFirebase = false;
  private firestore: any = null;

  constructor() {
    this.isServerless = process.env.VERCEL === "1" || !!process.env.AWS_LAMBDA_FUNCTION_VERSION;
    
    // Check if Firebase environment variables are provided
    this.useFirebase = !!(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    );

    if (this.useFirebase) {
      this.initFirebase();
    }
  }

  private initFirebase() {
    try {
      if (!getApps().length) {
        // Format private key properly to handle newlines
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
          })
        });
      }
      this.firestore = getFirestore();
      console.log("Firebase Engine: Successfully connected to Cloud Firestore.");
    } catch (err) {
      console.error("Firebase Engine: Failed to initialize Firestore. Falling back to SQLite/JSON. Error:", err);
      this.useFirebase = false;
    }
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
   * Execute query. If Firebase is active, redirects to Firestore. Otherwise, runs SQLite/JSON.
   */
  public async query(sql: string, params: any[] = []): Promise<any> {
    if (this.useFirebase && this.firestore) {
      try {
        return await this.queryFirebase(sql, params);
      } catch (err) {
        console.error("Firebase Engine: Query failed. Falling back to local/in-memory engine. Error:", err);
      }
    }

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
   * SQL Simulator layer for Firebase Cloud Firestore
   */
  private async queryFirebase(sql: string, params: any[] = []): Promise<any> {
    const normalizedSql = sql.trim().replace(/\s+/g, " ");

    // 1. INSERT INTO visits (id, timestamp, dayOfWeek, userAgent) VALUES (?, ?, ?, ?)
    if (normalizedSql.match(/^INSERT INTO visits/i)) {
      const [id, timestamp, dayOfWeek, userAgent] = params;
      const visitId = id || "visit_" + Math.random().toString(36).substring(2, 9);
      const visitDoc: Visit = {
        id: visitId,
        timestamp: timestamp || new Date().toISOString(),
        dayOfWeek: typeof dayOfWeek === "number" ? dayOfWeek : new Date().getDay(),
        userAgent: userAgent || ""
      };
      
      await this.firestore.collection("visits").doc(visitId).set(visitDoc);
      return { success: true, lastID: visitId };
    }

    // 2. SELECT COUNT(*) FROM visits
    if (normalizedSql.match(/SELECT COUNT\(\*\)/i)) {
      const snapshot = await this.firestore.collection("visits").count().get();
      return [{ count: snapshot.data().count }];
    }

    // 3. SELECT dayOfWeek, COUNT(*) FROM visits GROUP BY dayOfWeek
    if (normalizedSql.match(/GROUP BY dayOfWeek/i)) {
      const snapshot = await this.firestore.collection("visits").get();
      const counts: Record<number, number> = {};
      for (let i = 0; i < 7; i++) {
        counts[i] = 0; // Pre-fill days 0 to 6
      }
      
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        const day = typeof data.dayOfWeek === "number" ? data.dayOfWeek : 0;
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
      const limit = limitMatch ? parseInt(limitMatch[1], 10) : 50;

      const snapshot = await this.firestore.collection("visits")
        .orderBy("timestamp", "desc")
        .limit(limit)
        .get();

      const results: Visit[] = [];
      snapshot.forEach((doc: any) => {
        results.push(doc.data() as Visit);
      });
      return results;
    }

    return [];
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
