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

import { register, loginUser } from "../api/user.js";

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
    const result = await signInWithPopup(auth, provider);
    
    const user = result.user;
    const token = await user.getIdToken();

    register(token, user.displayName);
  }

  async function signup(username, email, password) {
    console.log("Form Data before sending data to firebase", username, email, password);
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    const token = await credentials.user.getIdToken();
    register(token, username, password);
  }

  async function login(email, password) {
    console.log("data before logging in: ", email, password);
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    const token = await credentials.user.getIdToken();
    const user = await loginUser(token, password);
    console.log("Responded Data: ", user);
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}