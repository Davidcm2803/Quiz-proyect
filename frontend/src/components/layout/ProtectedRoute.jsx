import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;

    if (!user && !parsedUser) {
      alert("Debes iniciar sesión para acceder a esta sección.");
      navigate("/signup");
      return;
    }

    setChecking(false);
  }, [user, navigate]);

  if (checking) return null;

  return children;
}