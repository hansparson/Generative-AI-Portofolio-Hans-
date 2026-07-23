const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const sqlite3 = require('sqlite3');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const DB_FILE = path.join(process.cwd(), 'data', 'visitors.db');

async function cleanSqlite() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(DB_FILE)) {
      console.log('No local SQLite database found.');
      return resolve();
    }

    const db = new sqlite3.Database(DB_FILE);
    db.run(
      "DELETE FROM visits WHERE countryCode IS NULL OR countryCode = '' OR countryCode = 'empty' OR countryCode = 'Unknown'",
      function(err) {
        if (err) {
          console.warn('SQLite cleanup skipped (table structure might not have been fully migrated locally):', err.message);
          db.close();
          return resolve(); // Resolve successfully to proceed to Firestore
        }
        console.log(`SQLite: Successfully purged ${this.changes} legacy empty visits.`);
        db.close();
        resolve();
      }
    );
  });
}

async function cleanFirestore() {
  const hasFirebase = !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );

  if (!hasFirebase) {
    console.log('Firebase environment variables not set. Skipping Firestore clean.');
    return;
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey
    })
  });

  const db = getFirestore();
  const snap = await db.collection('visits').get();
  
  let deleteCount = 0;
  const batch = db.batch();

  snap.forEach(doc => {
    const data = doc.data();
    if (!data.countryCode || data.countryCode === 'empty' || data.countryCode === 'Unknown') {
      batch.delete(doc.ref);
      deleteCount++;
    }
  });

  if (deleteCount > 0) {
    await batch.commit();
    console.log(`Firestore: Successfully purged ${deleteCount} legacy empty visits.`);
  } else {
    console.log('Firestore: No empty visits found to purge.');
  }
}

async function main() {
  try {
    await cleanSqlite();
    await cleanFirestore();
    console.log('Database purification completed successfully!');
  } catch (e) {
    console.error('Purification failed:', e);
  }
}

main();
