import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert("Debes iniciar sesión para acceder a esta sección.");
      navigate("/signup");
    }
  }, [user, navigate]);

  if (!user) return null;

  return children;
}