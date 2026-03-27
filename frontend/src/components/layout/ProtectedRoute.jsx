import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

/*
  CAMBIA ESTE VALOR:
  true  = desactiva login (modo desarrollo)
  false = comportamiento normal con login
*/
const BYPASS_AUTH = true;

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!BYPASS_AUTH && !user) {
      alert("Debes iniciar sesión para acceder a esta sección.");
      navigate("/signup");
    }
  }, [user, navigate]);

  if (!BYPASS_AUTH && !user) return null;

  return children;
}