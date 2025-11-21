/**
 * @file FirebaseConfig.ts
 * @description Initializes the Firebase Admin SDK and exports shared instances
 * for authentication and Firestore database access.
 *
 * This module loads Firebase credentials from environment variables and ensures
 * the Admin SDK is initialized only once during the application's lifecycle.
 */

import admin, { auth } from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

/**
 * Firebase service account configuration.
 *
 * IMPORTANT:
 * - The private key must contain real newline characters (\n), not escaped ones.
 *   Therefore we replace `\\n` with `\n` to fix formatting issues in .env files.
 */
const serviceAccount: admin.ServiceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
} as admin.ServiceAccount;

/**
 * Initialize Firebase Admin SDK only once.
 */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * Firebase Auth instance.
 * Used to:
 *  - Verify ID tokens
 *  - Create users
 *  - Manage authentication providers
 */
export const firebaseAuth: auth.Auth = admin.auth();

/**
 * Firestore database reference.
 */
export const firebaseDB = admin.firestore();

/**
 * Optional export of the Firebase Admin SDK instance.
 */
export default admin;
