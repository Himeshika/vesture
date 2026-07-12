import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User, UserRole } from '@/types';

export const registerUser = async (email: string, password: string, name: string, role: UserRole = 'customer'): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  
  await updateFirebaseProfile(firebaseUser, { displayName: name });
  
  const userDoc: User = {
    uid: firebaseUser.uid,
    name,
    email,
    phone: null,
    role,
    profileImage: null,
    createdAt: serverTimestamp() as any,
  };
  
  await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);
  return userDoc;
};

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const updateUserProfile = async (
  uid: string,
  data: { name?: string; phone?: string; profileImage?: string | null }
): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
};

export const getCurrentUserDoc = async (uid: string): Promise<User | null> => {
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (userSnap.exists()) {
    return userSnap.data() as User;
  }
  return null;
};
