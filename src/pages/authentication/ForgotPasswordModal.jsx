import { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Stack,
  Grid,
} from "../../components";
import Authentication from "../../services/Authentication";

const ForgotPasswordModal = ({ onConfirm }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Envia a requisição de redefinição de senha ao Supabase.
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await Authentication.resetPassword(email);
      setMessage("Verifique seu e-mail para o link de redefinição de senha.");
    } catch (error) {
      console.error("Erro ao redefinir a senha:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh", padding: "16px" }}
    >
      <Grid item xs={12} sm={8} md={4}>
        <Card
          elevation={8}
          style={{
            padding: 32,
            borderRadius: 20,
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          }}
        >
          <CardContent>
            <form onSubmit={handleResetPassword}>
              <Stack spacing={3} style={{ width: "100%" }}>
                <Typography
                  variant="h5"
                  style={{
                    fontWeight: 800,
                    textAlign: "center",
                    color: "#388e3c",
                  }}
                >
                  Esqueceu a senha?
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ textAlign: "center" }}
                >
                  Digite seu e-mail para receber um link de redefinição.
                </Typography>
                <TextField
                  label="E-mail"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="outlined"
                  InputProps={{ style: { borderRadius: 10 } }}
                  InputLabelProps={{ style: { color: "#388e3c" } }}
                />
                {message && (
                  <Typography
                    variant="body2"
                    style={{
                      color: message.includes("Verifique")
                        ? "#388e3c"
                        : "#f44336",
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    {message}
                  </Typography>
                )}
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  style={{ marginTop: 16, width: "100%" }}
                >
                  <Button
                    onClick={onConfirm}
                    variant="outlined"
                    style={{
                      width: "50%",
                      borderRadius: 10,
                      color: "#f44336",
                      borderColor: "#f44336",
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    style={{
                      width: "50%",
                      borderRadius: 10,
                      backgroundColor: "#388e3c",
                    }}
                  >
                    {loading ? "Enviando..." : "Enviar Link"}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ForgotPasswordModal;
