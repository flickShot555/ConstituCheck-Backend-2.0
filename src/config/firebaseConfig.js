// src/config/firebaseConfig.js
import admin from "firebase-admin";
import fs from "fs";

export function initFirebase() {
  if (admin.apps && admin.apps.length) return admin;

  const firebaseServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!firebaseServiceAccount) {
    console.warn("FIREBASE_SERVICE_ACCOUNT_JSON not set — Firebase auth verification will fail for protected endpoints.");
    return null;
  }

  // service account JSON can be stored as a string in env; parse it
  let cred;
  try {
    cred = JSON.parse(firebaseServiceAccount);
  } catch (err) {
    console.error("Invalid FIREBASE_SERVICE_ACCOUNT_JSON:", err.message);
    return null;
  }

  admin.initializeApp({
    credential: admin.credential.cert(cred),
  });

  return admin;
}
