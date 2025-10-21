import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/SupabaseClient";
import { Typography } from "../../components"; // Usamos Typography para a mensagem de loading

const AuthRedirect = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Checa o hash da URL para capturar o parâmetro 'type=recovery' do Supabase.
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const isRecoveryUrl = urlParams.get("type") === "recovery";

    if (isRecoveryUrl) {
      // Se for um link de recuperação, redireciona imediatamente para o formulário de nova senha.
      setLoading(false);
      navigate("/update-password", { replace: true });
      return;
    }

    // Listener de Autenticação para lidar com login/logout normal.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setLoading(false);

        if (session) {
          // Se há sessão (usuário logado), redireciona para a home.
          navigate("/home", { replace: true });
        } else {
          // Se não há sessão, redireciona para o login.
          navigate("/login", { replace: true });
        }
      }
    );

    // Limpa o listener ao desmontar o componente.
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

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
