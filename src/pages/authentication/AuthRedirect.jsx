import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../services/SupabaseClient";
import { Typography } from "../../components";

const AuthRedirect = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.hash.substring(1));
    const type = params.get("type");

    // Redireciona imediatamente para a página de redefinição se for um link de recuperação.
    if (type === "recovery") {
      setLoading(false);
      navigate("/update-password", { replace: true });
      return;
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setLoading(false);

        // Se houver uma sessão válida, redireciona para a Home.
        if (session) {
          navigate("/home", { replace: true });
        } else {
          // Caso não haja sessão, redireciona para o Login.
          navigate("/login", { replace: true });
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, location.hash]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0f2f7 0%, #c4e0e8 100%)",
        color: "#388e3c",
      }}
    >
      <Typography variant="h5" style={{ fontWeight: 600, textAlign: "center" }}>
        {loading
          ? "Verificando autenticação e redirecionando..."
          : "Redirecionando..."}
      </Typography>
    </div>
  );
};

export default AuthRedirect;
