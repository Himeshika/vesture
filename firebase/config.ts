import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp, getApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDy2Gs_UfJp25E8HXnx0A4jFfdceKq2LV4",
  authDomain: "vesture-81567.firebaseapp.com",
  projectId: "vesture-81567",
  storageBucket: "vesture-81567.firebasestorage.app",
  messagingSenderId: "315668526074",
  appId: "1:315668526074:web:6315a0298ded2cea84aa43"
};

// Prevent duplicate initialisation during hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Prevent duplicate auth initialisation during hot reload
// initializeAuth throws if called twice on the same app — use getAuth() as fallback.
function getOrInitAuth() {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

export const auth = getOrInitAuth();
export const db = getFirestore(app);
export default app;

// NOTE: Firebase Storage is intentionally NOT initialised here.
// All media goes through services/cloudinaryService.ts instead.
