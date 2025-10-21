import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Snackbar,
  Grid,
  Stack,
} from "../../components";
import { supabase } from "../../services/SupabaseClient";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const navigate = useNavigate();

  // Função para atualizar a senha do usuário logado via link de recuperação.
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setSnackbarMsg("As senhas não coincidem!");
      setShowSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      // Chama a API do Supabase para atualizar a senha.
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      setSnackbarMsg("Senha atualizada com sucesso! Redirecionando...");
      setShowSnackbar(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Erro ao atualizar a senha:", error);
      setSnackbarMsg(error.message);
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      component="main"
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: "100vh",
        // Estilo temático de fundo (mesmo do Login/Register)
        background: "linear-gradient(135deg, #e0f2f7 0%, #c4e0e8 100%)",
        backgroundImage: 'url("/images/food_background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        padding: "16px",
      }}
    >
      <Grid item xs={12} sm={8} md={5} lg={4}>
        <Card
          elevation={8}
          style={{
            padding: 32,
            borderRadius: 20,
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(5px)",
          }}
        >
          <CardContent>
            <form style={{ width: "100%" }} onSubmit={handleUpdatePassword}>
              <Stack direction="column" alignItems="center" spacing={3}>
                <Typography
                  variant="h4"
                  style={{
                    fontWeight: 800,
                    color: "#388e3c",
                    marginBottom: 16,
                  }}
                >
                  Nova Senha
                </Typography>
                <TextField
                  label="Nova Senha"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#388e3c" } }}
                  InputProps={{ style: { borderRadius: 10 } }}
                />
                <TextField
                  label="Confirmar Nova Senha"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#388e3c" } }}
                  InputProps={{ style: { borderRadius: 10 } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    backgroundColor: "#388e3c",
                    "&:hover": {
                      backgroundColor: "#2e7d32",
                    },
                  }}
                >
                  {loading ? "Salvando..." : "Salvar Nova Senha"}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
        <Snackbar
          open={showSnackbar}
          autoHideDuration={4000}
          onClose={() => setShowSnackbar(false)}
          message={snackbarMsg}
        />
      </Grid>
    </Grid>
  );
};

export default UpdatePassword;
