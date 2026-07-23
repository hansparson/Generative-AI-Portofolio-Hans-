const dotenv = require('dotenv');
dotenv.config();

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const hasFirebase = !!(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

if (!hasFirebase) {
  console.log('Firebase environment variables not set. Exiting.');
  process.exit(1);
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

async function main() {
  const snap = await db.collection('visits').get();
  const batch = db.batch();
  let count = 0;

  snap.forEach(doc => {
    const data = doc.data();
    const ts = data.timestamp;

    if (ts) {
      const date = new Date(ts);
      // Get Jakarta local time (UTC+7) representation
      // We can get UTC milliseconds and add 7 hours
      const jakartaTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
      const correctDayOfWeek = jakartaTime.getUTCDay();

      if (data.dayOfWeek !== correctDayOfWeek) {
        console.log(`Fixing Visit ID ${doc.id}: Timestamp ${ts} (UTC Day ${date.getUTCDay()} -> Jakarta Day ${correctDayOfWeek})`);
        batch.update(doc.ref, { dayOfWeek: correctDayOfWeek });
        count++;
      }
    }
  });

  if (count > 0) {
    await batch.commit();
    console.log(`Successfully corrected ${count} database timezone offsets.`);
  } else {
    console.log('No visits needed corrections.');
  }
}

main();
