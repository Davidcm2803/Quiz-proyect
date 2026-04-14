const ENV = import.meta.env;

const config = {
  // ── API & WebSocket ──────────────────────────────────────────────
  API_URL: ENV.VITE_API_URL || "https://quiz-proyect.onrender.com",
  WS_URL:  ENV.VITE_WS_URL  || "wss://quiz-proyect.onrender.com",

  // ── AI / Groq ────────────────────────────────────────────────────
  GROQ_KEY: ENV.VITE_QHIT_KEY || "",

  // ── Unsplash ─────────────────────────────────────────────────────
  UNSPLASH_KEY: ENV.VITE_UNSPLASH_KEY || "",

  // ── NASA ─────────────────────────────────────────────────────────
  NASA_KEY: ENV.VITE_NASA_API_KEY || "",

  // ── Firebase ─────────────────────────────────────────────────────
  firebase: {
    apiKey:            ENV.VITE_FIREBASE_API_KEY             || "",
    authDomain:        ENV.VITE_FIREBASE_AUTH_DOMAIN         || "",
    projectId:         ENV.VITE_FIREBASE_PROJECT_ID          || "",
    storageBucket:     ENV.VITE_FIREBASE_STORAGE_BUCKET      || "",
    messagingSenderId: ENV.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId:             ENV.VITE_FIREBASE_APP_ID              || "",
  },
};

export default config;