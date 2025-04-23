import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { register, loginUser, verify } from "../api/user.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          token,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const firebaseUser = result.user;
    const token = await firebaseUser.getIdToken();

    await register(token, firebaseUser.displayName);

    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      token,
    });
  }

  async function signup(username, email, password) {
    console.log("Form Data before sending data to firebase", username, email, password);
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    const token = await credentials.user.getIdToken();

    await register(token, username, password);

    setUser({
      uid: credentials.user.uid,
      email: credentials.user.email,
      displayName: username,
      photoURL: credentials.user.photoURL,
      token,
    });
  }

  async function login(email, password) {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    const token = await credentials.user.getIdToken();
    const userData = await loginUser(token, password);
    setUser({
      uid: credentials.user.uid,
      email: credentials.user.email,
      displayName: userData?.username || credentials.user.displayName,
      photoURL: credentials.user.photoURL,
      token,
      ...userData,
    });
  }

  async function verifyUser() {
    if (!auth.currentUser) return null;

    const token = await auth.currentUser.getIdToken();
    try {
      const verifiedData = await verify(token);
      console.log("Messaging from auth context, verify User");
      return verifiedData;
    } catch (error) {
      console.error("User verification failed:", error);
      return null;
    }
  }

  async function logout() {
    console.log("logging out");
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, signup, login, logout, verifyUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
