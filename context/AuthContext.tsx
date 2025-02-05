/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../firebase/firebaseClient";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: any;
  role: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  registerUser: (
    email: string,
    password: string,
    role: "customer" | "agent"
  ) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  logout: async () => {},
  registerUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch the user's role from Firestore (Assumes a "users" collection with doc ID equal to user.uid)
        const roleDoc = await getDoc(doc(firestore, "users", currentUser.uid));
        if (roleDoc.exists()) {
          setRole(roleDoc.data().role);
        } else {
          // Optionally, set a default role or handle missing role data
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
  };

  const registerUser = async (
    email: string,
    password: string,
    role: "customer" | "agent"
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(firestore, "users", user.uid), {
      email: user.email,
      role: role, // Store user role
    });

    return user;
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
