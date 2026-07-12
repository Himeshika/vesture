import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUserDoc 
} from '@/firebase/authService';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: FirebaseUser | null;
  userDoc: User | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserDoc: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userDoc, setUserDoc] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserDoc = async (uid: string) => {
    try {
      const doc = await getCurrentUserDoc(uid);
      if (doc) {
        setUserDoc(doc);
        setRole(doc.role);
      } else {
        setUserDoc(null);
        setRole(null);
      }
    } catch (error) {
      console.error('Failed to fetch user doc:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserDoc(firebaseUser.uid);
      } else {
        setUserDoc(null);
        setRole(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await loginUser(email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    await registerUser(email, password, name);
  };

  const logout = async () => {
    await logoutUser();
  };

  const refreshUserDoc = async () => {
    if (user) {
      await fetchUserDoc(user.uid);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userDoc,
      role,
      isLoading,
      login,
      register,
      logout,
      refreshUserDoc,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
