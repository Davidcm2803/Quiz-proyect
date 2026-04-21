import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import config from "../config";

const app = initializeApp(config.firebase);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

let popupOpen = false;

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const signInWithGoogle = async () => {
  if (popupOpen) return null;
  popupOpen = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("1. popup ok", result.user.email);
    const idToken = await result.user.getIdToken();
    console.log("2. token ok", idToken.slice(0, 20));
    return { user: result.user, idToken };
  } catch (error) {
    console.error("ERROR CODE:", error.code);
    console.error("ERROR MSG:", error.message);
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