import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
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
        const session = await verify();
        if (session?.data?.uid) {
          const fullUser = {
            uid: session.data.uid,
            displayName: session.data.user?.name || "Guest",
            email: session.data.user?.email || null,
            fromCookie: true
          };
          setUser(fullUser);
        }
      } catch (error) {
        console.error("Cookie session check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkCookieSession();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const newUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          token,
        };
        setUser(newUser);
        await connectSocket(token);
      }
    });;

    return () => unsubscribe();
  }, []);

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const firebaseUser = result.user;
    const token = await firebaseUser.getIdToken();

    await register(token, firebaseUser.displayName);

    if (!firebaseUser.displayName) {
      await updateProfile(firebaseUser, {
        displayName: firebaseUser.displayName || "Guest"
      });
    }

    const newUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || "Guest",
      token,
    };

    setUser(newUser);
    await connectSocket(token);
  }


  async function signup(username, email, password) {
    try {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      const token = await credentials.user.getIdToken();

      await updateProfile(credentials.user, {
        displayName: username
      });

      await register(token, username, password);

      const newUser = {
        uid: credentials.user.uid,
        email: credentials.user.email,
        displayName: username,
        token,
      };

      setUser(newUser);
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
      const displayNameFromDB = userData.data.user.name;

      if (!credentials.user.displayName) {
        await updateProfile(credentials.user, {
          displayName: displayNameFromDB
        });
      }

      const newUser = {
        uid: credentials.user.uid,
        email: credentials.user.email,
        displayName: displayNameFromDB,
        token,
        ...userData,
      };

      setUser(newUser);
      await connectSocket(token);
    } catch (error) {
      console.error("Login error:", error);
    }
  }


  async function verifyUser() {
    try {
      const verifiedData = await verify();
      console.log("From VerifyUser: ", verifiedData);
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
