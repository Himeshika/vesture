import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// SETUP INSTRUCTIONS
// 1. Go to https://console.firebase.google.com
// 2. Create a new project: "Vesture"
// 3. Enable Authentication → Sign-in method → Email/Password → Enable
// 4. Create Firestore Database → Start in test mode → Region: asia-south1 (or nearest to you)
// 5. Apply the security rules from `firestore.rules` before going live
// 6. Add a Web app under Project Settings → copy the config object below

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Prevent duplicate initialisation during hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export default app;

// NOTE: Firebase Storage is intentionally NOT initialised here.
// All media (item photos, avatars) goes through services/cloudinaryService.ts instead.
