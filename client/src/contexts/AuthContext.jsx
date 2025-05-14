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

import { register, loginUser, verify, logoutUser } from "../api/user.js";
import { connectSocket } from "../api/socket.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCookieSession = async () => {
      try {
        const cookieSession = await verify();
        if (cookieSession?.data?.uid) {
          setUser({
            uid: cookieSession.data.uid,
            fromCookie: true
          });
        }
      } catch (error) {
        console.error("Cookie session check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCookieSession();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          token,
        });
      } else {
        try {
          const cookieSession = await verify();
          if (cookieSession?.data?.uid) {
            setUser({
              uid: cookieSession.data.uid,
              fromCookie: true
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Secondary cookie check failed:", error);
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const firebaseUser = result.user;
    const token = await firebaseUser.getIdToken();
    await register(firebaseUser.displayName);

    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      token,
    });

    await connectSocket(token);
  }

  async function signup(username, email, password) {
    console.log("Form Data before sending data to Firebase:", username, email, password);

    try {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      const token = await credentials.user.getIdToken();
      console.log("Firebase token obtained:", token ? "Token received" : "No token");

      const response = await register(token, username, password);
      console.log("Backend registration response:", response.data);

      setUser({
        uid: credentials.user.uid,
        email: credentials.user.email,
        displayName: username,
        token,
      });

      await connectSocket(token);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }


  async function login(email, password) {
    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      const token = await credentials.user.getIdToken();
      const userData = await loginUser(token, password);
      console.log("User logged in");
      setUser({
        uid: credentials.user.uid,
        email: credentials.user.email,
        displayName: userData?.username || credentials.user.displayName,
        token,
        ...userData,
      });
      console.log("Token being sent to socket:", !!token);
      await connectSocket(token);
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  async function verifyUser() {
    try {
      const verifiedData = await verify();
      console.log("User Verification status: ", !!verifiedData);
      return verifiedData;
    } catch (error) {
      console.error("User verification failed:", error);
      return null;
    }
  }


  async function logout() {
    console.log("logging out");
    const res = await logoutUser();
    console.log(res);
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, signup, login, logout, verifyUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
