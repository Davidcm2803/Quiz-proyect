import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

const BYPASS_AUTH = false;

export default function ProtectedRoute({ children }) {
  const { token, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!BYPASS_AUTH && !token && !isLoading) {
      alert("Debes iniciar sesión para acceder a esta sección.");
      navigate("/signup");
    }
  }, [token, isLoading, navigate]);

  if (isLoading) return null;
  if (!BYPASS_AUTH && !token) return null;

  return children;
}