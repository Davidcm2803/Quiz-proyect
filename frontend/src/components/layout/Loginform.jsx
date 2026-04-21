import { useState } from "react";
import IconButton from "../ui/IconButtons";
import LoginButton from "../ui/LoginButton";
import { GoogleIcon, MicrosoftIcon } from "../ui/Icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signInWithGoogle, signInWithMicrosoft, resetPassword } from "../../firebase/firebase";
import config from "../../config";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        setError("Please fill all fields");
        return;
      }

      const response = await fetch(`${config.API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = Array.isArray(data.detail)
          ? data.detail[0]?.msg || "Error de validación"
          : data.detail || "Login failed";
        setError(msg);
        return;
      }

      login(data.access_token, data.user);
      window.location.href = "/";
    } catch (err) {
      console.error("CATCH ERROR:", err);
      setError("Server connection error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (!result) return;

      const response = await fetch(`${config.API_URL}/users/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: result.idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Google login failed");
        return;
      }

      login(data.access_token, data.user);
      window.location.href = "/";
    } catch (error) {
      if (error.message === "POPUP_BLOCKED") {
        setError("Allow popups for this site and try again.");
        return;
      }
      console.error(error);
      setError("Google login error");
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      const result = await signInWithMicrosoft();
      if (!result) return;

      const response = await fetch(`${config.API_URL}/users/microsoft-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: result.idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Microsoft login failed");
        return;
      }

      login(data.access_token, data.user);
      window.location.href = "/";
    } catch (error) {
      if (error.message === "POPUP_BLOCKED") {
        setError("Allow popups for this site and try again.");
        return;
      }
      console.error(error);
      setError("Microsoft login error");
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetMessage("Please enter your email.");
      return;
    }
    try {
      await resetPassword(resetEmail);
      setResetMessage("Check your email Spam for the reset link :)");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setResetMessage("No account found with that email.");
      } else {
        setResetMessage("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#F8FBF3] font-serif">
      <div className="bg-white rounded-2xl p-10 w-[340px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#e8e0d4]">
        <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-6">
          Log in
        </h2>

        <div className="flex gap-2.5 mb-4">
          {[
            { icon: <GoogleIcon />, label: "Google", onClick: handleGoogleLogin },
            { icon: <MicrosoftIcon />, label: "Microsoft", onClick: handleMicrosoftLogin },
          ].map(({ icon, label, onClick }) => (
            <IconButton key={label} icon={icon} label={label} onClick={onClick} />
          ))}
        </div>

        <button className="w-full py-[11px] bg-white border border-[#ddd] rounded-lg mb-4 text-sm text-gray-700 hover:border-gray-400 transition-colors">
          Continue with work email
        </button>

        <div className="flex items-center gap-3 mb-4 text-[#999] text-sm">
          <div className="flex-1 h-px bg-[#e0d8cc]" />
          or
          <div className="flex-1 h-px bg-[#e0d8cc]" />
        </div>

        <input
          type="text"
          placeholder="Username / Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => setFocusedField("username")}
          onBlur={() => setFocusedField(null)}
          className={`w-full px-[14px] py-[11px] border rounded-lg text-sm text-[#333] bg-white outline-none mb-2.5 box-border transition-colors ${
            focusedField === "username" ? "border-[#555]" : "border-[#ddd]"
          }`}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField(null)}
          className={`w-full px-[14px] py-[11px] border rounded-lg text-sm text-[#333] bg-white outline-none mb-2.5 box-border transition-colors ${
            focusedField === "password" ? "border-[#555]" : "border-[#ddd]"
          }`}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <p className="text-[13px] text-[#555] mb-[18px]">
          Forgot password?{" "}
          <button
            onClick={() => { setShowReset(true); setResetMessage(""); }}
            className="text-[#1a1a1a] font-semibold underline bg-transparent border-none cursor-pointer p-0"
          >
            Reset your password
          </button>
        </p>

        <LoginButton onClick={handleLogin}>Log in</LoginButton>

        <p className="text-sm text-center text-[#555] mb-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#1a1a1a] font-semibold underline">
            Sign up
          </Link>
        </p>

        <p className="text-xs text-[#888] leading-relaxed">
          By signing up, you accept our{" "}
          <a href="#" className="text-[#666] underline">Terms and Conditions</a>
          . Please read our{" "}
          <a href="#" className="text-[#666] underline">Privacy Notice</a>.
        </p>
      </div>

      {showReset && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[320px] shadow-lg border border-[#e8e0d4]">
            <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">Reset your password</h3>
            <p className="text-sm text-[#666] mb-4">Enter your email and we'll send you a reset link.</p>
            <input
              type="email"
              placeholder="Your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-[14px] py-[11px] border border-[#ddd] rounded-lg text-sm text-[#333] bg-white outline-none mb-3 box-border"
            />
            {resetMessage && (
              <p className={`text-sm mb-3 ${resetMessage.includes("Check") ? "text-green-600" : "text-red-500"}`}>
                {resetMessage}
              </p>
            )}
            <button
              onClick={handleResetPassword}
              className="w-full py-[11px] bg-[#1a1a1a] text-white rounded-lg text-sm font-semibold mb-2 hover:bg-[#333] transition-colors"
            >
              Send reset link
            </button>
            <button
              onClick={() => { setShowReset(false); setResetEmail(""); setResetMessage(""); }}
              className="w-full py-[11px] bg-white border border-[#ddd] rounded-lg text-sm text-gray-700 hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}