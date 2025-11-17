import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Modal,
} from "../../components";
import Authentication from "../../services/Authentication";
import ForgotPasswordModal from "./ForgotPasswordModal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await Authentication.login(email, password);
      setLoginAttempts(0);

      setSnackbarMsg("Login realizado com sucesso!");
      setShowSnackbar(true);

      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (error) {
      setLoginAttempts((prev) => prev + 1);

      console.error("Erro ao fazer login:", error);
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
            <form style={{ width: "100%" }} onSubmit={handleLogin}>
              <Stack direction="column" alignItems="center" spacing={3}>
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
                    marginBottom: 16,
                  }}
                >
                  Bem-vindo(a)!
                </Typography>

                <Stack spacing={2} style={{ width: "100%" }}>
                  <TextField
                    label="E-mail"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    variant="outlined"
                    InputLabelProps={{
                      style: { color: "#388e3c" },
                    }}
                    InputProps={{
                      style: { borderRadius: 10 },
                    }}
                  />
                  <TextField
                    label="Senha"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    variant="outlined"
                    InputLabelProps={{
                      style: { color: "#388e3c" },
                    }}
                    InputProps={{
                      style: { borderRadius: 10 },
                    }}
                  />
                </Stack>
                <Stack style={{ width: "100%" }}>
                  <CardActions style={{ justifyContent: "center", padding: 0 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        backgroundColor: "#388e3c",
                        "&:hover": {
                          backgroundColor: "#2e7d32",
                        },
                      }}
                      disabled={loading}
                    >
                      {loading ? "Entrando..." : "Entrar"}
                    </Button>
                  </CardActions>
                </Stack>
                <Typography
                  variant="body2"
                  style={{ marginTop: 16, color: "#555" }}
                >
                  Não tem uma conta?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "#1976d2",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Cadastre-se aqui
                  </Link>
                </Typography>

                {loginAttempts >= 3 && (
                  <Typography
                    variant="body2"
                    style={{ marginTop: 8, textAlign: "center" }}
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowForgotPasswordModal(true);
                      }}
                      style={{ color: "#f44336", textDecoration: "underline" }}
                    >
                      Esqueceu a senha?
                    </a>
                  </Typography>
                )}
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMsg}
      />

      <Modal
        open={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      >
        <ForgotPasswordModal
          email={email}
          onConfirm={() => setShowForgotPasswordModal(false)}
        />
      </Modal>
    </Grid>
  );
};

export default Login;
