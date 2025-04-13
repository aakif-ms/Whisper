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

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState("");

  useEffect(() => {
    function loggedIn() {
      onAuthStateChanged(auth, (user) => {
        setUser(user);
      });
    }
    return loggedIn();
  }, []);

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function signup(email, password) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{user, loginWithGoogle, signup, login, logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
    return useContext(AuthContext)
}