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
import { supabase } from "../../services/SupabaseClient";

const UpdateUsernameModal = ({
  currentUserId,
  currentEmail,
  currentName,
  onUpdateSuccess,
  onClose,
}) => {
  const [newUsername, setNewUsername] = useState(
    currentName || currentEmail.split("@")[0] || ""
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Chama a função do Supabase para atualizar a metadata do usuário
      const { error } = await supabase.auth.updateUser({
        data: { full_name: newUsername },
      });

      if (error) {
        throw error;
      }

      setMessage("Nome de usuário atualizado com sucesso!");

      // Chama a função de sucesso no Profile para fechar o modal e atualizar o estado do componente pai
      setTimeout(() => {
        onUpdateSuccess(newUsername);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
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
            <form onSubmit={handleUpdateUsername}>
              <Stack spacing={3} alignItems="center">
                <Typography
                  variant="h5"
                  style={{
                    fontWeight: 800,
                    color: "#388e3c",
                    textAlign: "center",
                  }}
                >
                  Alterar Nome
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ textAlign: "center" }}
                >
                  Seu nome será usado para personalização.
                </Typography>

                <TextField
                  label="Novo Nome de Usuário"
                  fullWidth
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#388e3c" } }}
                  InputProps={{ style: { borderRadius: 10 } }}
                />

                {message && (
                  <Typography
                    variant="body2"
                    style={{
                      color: message.includes("sucesso")
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
                  style={{
                    width: "100%",
                    justifyContent: "flex-end",
                    marginTop: 16,
                  }}
                >
                  <Button
                    onClick={onClose}
                    variant="outlined"
                    style={{
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
                    style={{ borderRadius: 10, backgroundColor: "#388e3c" }}
                  >
                    {loading ? "Salvando..." : "Salvar"}
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

export default UpdateUsernameModal;
