'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Development mode - bypass Firebase for testing
const isDevelopment = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDevelopment) {
      // Mock user for development
      setUser({
        uid: 'dev-user',
        email: 'admin@jaldarpan.com',
        displayName: 'Admin User',
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => 'dev-token',
        getIdTokenResult: async () => ({
          token: 'dev-token',
          authTime: new Date().toISOString(),
          issuedAtTime: new Date().toISOString(),
          expirationTime: new Date(Date.now() + 3600000).toISOString(),
          signInProvider: 'password',
          signInSecondFactor: null,
          claims: {},
        }),
        reload: async () => {},
        toJSON: () => ({}),
      } as User);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    if (isDevelopment) {
      // Mock login for development
      setUser({
        uid: 'dev-user',
        email: email,
        displayName: 'Admin User',
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => 'dev-token',
        getIdTokenResult: async () => ({
          token: 'dev-token',
          authTime: new Date().toISOString(),
          issuedAtTime: new Date().toISOString(),
          expirationTime: new Date(Date.now() + 3600000).toISOString(),
          signInProvider: 'password',
          signInSecondFactor: null,
          claims: {},
        }),
        reload: async () => {},
        toJSON: () => ({}),
      } as User);
      return;
    }

    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (isDevelopment) {
      setUser(null);
      return;
    }

    await signOut(auth);
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
