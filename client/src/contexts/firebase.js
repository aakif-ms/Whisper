import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const { VITE_API_KEY, VITE_AUTH_DOMAIN, VITE_PROJECT_ID, VITE_STORAGE_BUCKET, VITE_SENDERID, VITE_APPID } = import.meta.env;

const firebaseConfig = {
  apiKey: VITE_API_KEY,
  authDomain: VITE_AUTH_DOMAIN,
  projectId: VITE_PROJECT_ID,
  storageBucket: VITE_STORAGE_BUCKET,
  messagingSenderId: VITE_SENDERID,
  appId: VITE_APPID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)