import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import IconButton from "../ui/IconButtons";
import LoginButton from "../ui/LoginButton";
import { GoogleIcon, MicrosoftIcon, AppleIcon, OtherIcon } from "../ui/Icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { setToken } = useContext(AuthContext);

const handleLogin = async () => {
  try {
    
    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    const response = await fetch("http://localhost:8000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: username,  
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.detail || "Login failed");
      return;
    }

    setToken(data.access_token);

    // redirigir al home
    navigate("/");

  } catch (error) {
    console.error(error);
    setError("Server connection error");
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
            { icon: <GoogleIcon />, label: "Google" },
            { icon: <MicrosoftIcon />, label: "Microsoft" },
            { icon: <AppleIcon />, label: "Apple" },
            { icon: <OtherIcon />, label: "Other" },
          ].map(({ icon, label }) => (
            <IconButton key={label} icon={icon} label={label} onClick={() => {}} />
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
        {error && (
          <p className="text-red-500 text-sm mb-2">
            {error}
          </p>
        )}

        <p className="text-[13px] text-[#555] mb-[18px]">
          Forgot password?{" "}
          <a href="#" className="text-[#1a1a1a] font-semibold underline">
            Reset your password
          </a>
        </p>

        <LoginButton onClick={handleLogin}>
          Log in
        </LoginButton>

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
    </div>
  );
}