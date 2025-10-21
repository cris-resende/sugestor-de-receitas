import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Typography,
  Snackbar,
  Avatar,
  Grid,
  Stack,
} from "../../components";
import Authentication from "../../services/Authentication";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para lidar com o envio do formulário de registro (criação de nova conta).
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setSnackbarMsg("Preencha todos os campos!");
      setShowSnackbar(true);
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbarMsg("As senhas não coincidem!");
      setShowSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      // Chama o serviço de autenticação para registrar o usuário.
      await Authentication.register(email, password);

      setSnackbarMsg(
        "Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta."
      );
      setShowSnackbar(true);

      // Limpar os campos do formulário
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Erro ao registrar:", error);
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
        // Estilo temático de fundo (mesmo do Login)
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
            <form style={{ width: "100%" }} onSubmit={handleRegister}>
              <Stack direction="column" alignItems="center" spacing={3}>
                {/* Logo do Site */}
                <Avatar
                  src="/logo192.png"
                  alt="Recipe AI Logo"
                  style={{
                    width: 120,
                    height: 120,
                    marginBottom: 16,
                    backgroundColor: "transparent",
                    objectFit: "contain",
                  }}
                  variant="square"
                />

                <Typography
                  variant="h4"
                  style={{
                    fontWeight: 800,
                    color: "#388e3c",
                    marginBottom: 8,
                  }}
                >
                  Cadastro
                </Typography>

                <Stack spacing={2} style={{ width: "100%" }}>
                  <TextField
                    label="Nome"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#388e3c" } }}
                    InputProps={{ style: { borderRadius: 10 } }}
                  />
                  <TextField
                    label="E-mail"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#388e3c" } }}
                    InputProps={{ style: { borderRadius: 10 } }}
                  />
                  <TextField
                    label="Senha"
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
                    label="Confirmar Senha"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#388e3c" } }}
                    InputProps={{ style: { borderRadius: 10 } }}
                  />
                </Stack>
                <Stack style={{ width: "100%" }}>
                  <CardActions style={{ justifyContent: "center", padding: 0 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      onClick={handleRegister}
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
                      {loading ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                  </CardActions>
                </Stack>
                <Typography
                  variant="body2"
                  style={{ marginTop: 16, color: "#555" }}
                >
                  Já tem uma conta?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "#1976d2",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Entre aqui
                  </Link>
                </Typography>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMsg}
      />
    </Grid>
  );
};

export default Register;
