import { useState } from "react";
import IconButton from "../ui/IconButtons";
import LoginButton from "../ui/LoginButton";
import { GoogleIcon, MicrosoftIcon, AppleIcon, OtherIcon } from "../ui/Icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signInWithGoogle } from "../../firebase/firebase";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setError("Don't forget about filling in all fields :)");
      return;
    }
    if (password !== confirmPassword) {
      setError("Make sure your passwords match ;)");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        data = { detail: "La respuesta no vino en formato JSON" };
      }

      if (!response.ok) {
        setError(data.detail || `Error creating account (${response.status})`);
        return;
      }

      alert("Welcome to QHit! Now you're part of the fun :D");
      navigate("/signup");
    } catch (error) {
      console.error(error);
      setError("Error creating account :(");
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithGoogle();
      if (!result) return;

      setTimeout(async () => {
        try {
          const response = await fetch("http://localhost:8000/users/google-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_token: result.idToken }),
          });

          const data = await response.json();

          if (!response.ok) {
            setError(data.detail || "Google sign up failed");
            return;
          }

          login(data.access_token, data.user);
          navigate("/");
        } catch (err) {
          console.error(err);
          setError("Google sign up error");
        }
      }, 500);
    } catch (error) {
      if (error.message === "POPUP_BLOCKED") {
        setError("Allow popups for this site and try again.");
        return;
      }
      console.error(error);
      setError("Google sign up error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#F8FBF3] font-serif">
      <div className="bg-white rounded-2xl p-10 w-[340px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#e8e0d4]">
        <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-tight mb-6">
          Sign up
        </h2>

        <div className="flex gap-2.5 mb-4">
          {[
            { icon: <GoogleIcon />, label: "Google", onClick: handleGoogleRegister },
            { icon: <MicrosoftIcon />, label: "Microsoft", onClick: () => {} },
            { icon: <AppleIcon />, label: "Apple", onClick: () => {} },
            { icon: <OtherIcon />, label: "Other", onClick: () => {} },
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

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setFocusedField("username")}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-[14px] py-[11px] border rounded-lg text-sm text-[#333] bg-white outline-none mb-2.5 box-border transition-colors ${
              focusedField === "username" ? "border-[#555]" : "border-[#ddd]"
            }`}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-[14px] py-[11px] border rounded-lg text-sm text-[#333] bg-white outline-none mb-2.5 box-border transition-colors ${
              focusedField === "email" ? "border-[#555]" : "border-[#ddd]"
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
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setFocusedField("confirmPassword")}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-[14px] py-[11px] border rounded-lg text-sm text-[#333] bg-white outline-none mb-2.5 box-border transition-colors ${
              focusedField === "confirmPassword" ? "border-[#555]" : "border-[#ddd]"
            }`}
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <LoginButton type="submit">Sign up</LoginButton>
        </form>

        <p className="text-sm text-center text-[#555] mb-5">
          Already have an account?{" "}
          <Link to="/signup" className="text-[#1a1a1a] font-semibold underline">
            Log in
          </Link>
        </p>

        <p className="text-xs text-[#888] leading-relaxed">
          By signing up, you accept our{" "}
          <a href="#" className="text-[#666] underline">Terms and Conditions</a>.
          Please read our{" "}
          <a href="#" className="text-[#666] underline">Privacy Notice</a>.
        </p>
      </div>
    </div>
  );
}