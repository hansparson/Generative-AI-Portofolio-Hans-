import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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
      await firestore.collection('messages').doc(submission.id).set(submission);
      console.log(`Firebase Engine: Stored message ${submission.id} to Firestore.`);
    } catch (err) {
      console.error("Firebase Engine: Failed to log message to Firestore. Falling back to memory. Error:", err);
    }
  }

  // Always push to global memory store as secondary backup / local dev fallback
  global.contactSubmissions.push(submission);

  return res.status(201).json({ success: true, submission });
}
