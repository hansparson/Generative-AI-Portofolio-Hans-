import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Fallback in-memory messages store inside the serverless instance container
global.contactSubmissions = global.contactSubmissions || [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Firebase is configured
  const useFirebase = !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );

  if (useFirebase) {
    try {
      if (!getApps().length) {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
          })
        });
      }
      const firestore = getFirestore();
      const snapshot = await firestore.collection('messages')
        .orderBy('timestamp', 'desc')
        .get();

      const submissions: any[] = [];
      snapshot.forEach((doc: any) => {
        submissions.push(doc.data());
      });
      
      return res.json(submissions);
    } catch (err) {
      console.error("Firebase Engine: Failed to retrieve messages from Firestore. Falling back to memory. Error:", err);
    }
  }

  // Fallback to in-memory store
  return res.json(global.contactSubmissions);
}
