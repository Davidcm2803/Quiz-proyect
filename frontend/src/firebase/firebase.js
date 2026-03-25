import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

let popupOpen = false;

export const signInWithGoogle = async () => {
  if (popupOpen) return null;
  popupOpen = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return { user: result.user, idToken };
  } catch (error) {
    if (error.code === "auth/popup-blocked") throw new Error("POPUP_BLOCKED");
    if (error.code === "auth/cancelled-popup-request") return null;
    if (error.code === "auth/popup-closed-by-user") return null;
    throw error;
  } finally {
    popupOpen = false;
  }
};

export const signInWithMicrosoft = async () => {
  const provider = new OAuthProvider("microsoft.com");
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    return { idToken };
  } catch (error) {
    if (error.code === "auth/account-exists-with-different-credential") {
      try {
        const googleResult = await signInWithPopup(auth, new GoogleAuthProvider());
        const idToken = await googleResult.user.getIdToken();
        return { idToken };
      } catch (googleError) {
        if (googleError.code === "auth/popup-blocked") throw new Error("POPUP_BLOCKED");
        if (googleError.code === "auth/popup-closed-by-user") return null;
        throw googleError;
      }
    }
    if (error.code === "auth/popup-blocked") throw new Error("POPUP_BLOCKED");
    if (error.code === "auth/popup-closed-by-user") return null;
    throw error;
  }
};
