import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  Typography,
  Stack,
  Button,
  Avatar,
  Snackbar,
  Fab,
  Box,
  Modal, // Importado para exibir o modal de nome
} from "../components";
import Database from "../services/Database";
import Authentication from "../services/Authentication";
import RecipeCard from "../components/custom/RecipeCard";
import { supabase } from "../services/SupabaseClient";
import RecipeAPI from "../services/RecipeAPI";
import CloseIcon from "@mui/icons-material/Close";
import UpdateUsernameModal from "./authentication/UpdateUsernameModal"; // Importar o Modal de Nome

const Profile = () => {
  const navigate = useNavigate();

  // ESTADOS
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  // ESTADOS DO USUÁRIO REAL
  const [userEmail, setUserEmail] = useState("Carregando...");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isManaging, setIsManaging] = useState(false); // Controla a visibilidade do gerenciamento
  const [userName, setUserName] = useState("Usuário"); // Nome real de exibição
  const [showUsernameModal, setShowUsernameModal] = useState(false); // Estado do modal de nome

  const MOCK_USERNAME = "Usuário";

  // Função para buscar informações do usuário logado (email e ID real)
  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Captura o nome da metadata, senão usa o email como nome formatado
        const displayName =
          user.user_metadata?.full_name || user.email.split("@")[0];

        setUserEmail(user.email);
        setCurrentUserId(user.id);
        setUserName(displayName); // Define o nome

        return user.id; // Retorna o UUID real
      } else {
        navigate("/login", { replace: true });
        return null;
      }
    } catch (err) {
      return null;
    }
  };

  // Busca as receitas favoritas e mescla com rating e detalhes da API
  const fetchFavorites = async (userId) => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Busca a lista básica de favoritos USANDO O ID REAL
      const favsFromDb = await Database.getUserFavorites(userId);

      // 2. Cria um array de Promises para buscar os detalhes e o Rating para CADA item
      const detailedFavsPromises = favsFromDb.map(async (fav) => {
        try {
          const spoonacularData = await RecipeAPI.getRecipeDetails(
            fav.recipe_id
          );
          const userRatingData = await Database.getSingleRecipeRating(
            userId,
            Number(fav.recipe_id)
          );

          return {
            ...fav,
            image: spoonacularData?.image || "/placeholder.png",
            user_rating: userRatingData?.ratingValue || 0,
          };
        } catch (itemError) {
          console.error(
            `Falha ao carregar detalhes para ${fav.recipe_id}:`,
            itemError
          );
          return { ...fav, image: "/error.png", user_rating: 0, error: true };
        }
      });

      const detailedFavorites = await Promise.all(detailedFavsPromises);
      const validFavorites = detailedFavorites.filter((fav) => !fav.error);

      setFavorites(validFavorites);

      if (validFavorites.length === 0 && favsFromDb.length > 0) {
        setError("Algumas receitas não puderam ser carregadas (erro na API).");
      }
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
      setError("Não foi possível carregar suas receitas favoritas.");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para remover o favorito diretamente da lista
  const handleRemoveFavorite = async (recipeIdToRemove) => {
    if (!currentUserId) return; // Não permite se não estiver logado

    try {
      // Usa o ID REAL para remover o favorito
      await Database.toggleFavorite(
        currentUserId,
        Number(recipeIdToRemove),
        "Receita",
        true
      );
      setSnackbarMsg("Receita removida dos favoritos.");
      fetchFavorites(currentUserId); // Recarrega a lista
    } catch (err) {
      setSnackbarMsg("Erro ao remover favorito.");
    } finally {
      setShowSnackbar(true);
    }
  };

  // Desloga o usuário e o redireciona para a tela de Login
  const handleLogout = async () => {
    try {
      await Authentication.logout();
      setTimeout(() => navigate("/login", { replace: true }), 500);
    } catch (err) {
      setSnackbarMsg("Erro ao deslogar.");
      setShowSnackbar(true);
    }
  };

  // Função para alternar o estado de gerenciamento (toggle)
  const handleToggleManagement = () => {
    setIsManaging((prev) => !prev);
  };

  // Função para atualizar o nome no estado local após o sucesso do modal
  const handleUsernameUpdateSuccess = (newUsername) => {
    // Atualiza o nome exibido no header
    setUserName(newUsername);
  };

  useEffect(() => {
    fetchUserData().then((userId) => {
      if (userId) fetchFavorites(userId);
    });
  }, []);

  // --- RENDERIZAÇÃO ---
  if (isLoading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e0f2f7 0%, #c4e0e8 100%)",
        }}
      >
        <Typography variant="h6">Carregando perfil...</Typography>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Grid
        container
        justifyContent="center"
        style={{
          background: "linear-gradient(135deg, #e0f2f7 0%, #c4e0e8 100%)",
          padding: "16px 8px",
        }}
      >
        <Grid item xs={12} sm={10} md={8}>
          <Stack
            spacing={3}
            style={{ paddingTop: "24px", paddingBottom: "32px" }}
          >
            {/* 1. HEADER E INFORMAÇÕES BÁSICAS DO PERFIL */}
            <Card
              elevation={4}
              style={{
                padding: 24,
                borderRadius: 16,
                background: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <Stack spacing={2} alignItems="center">
                <Avatar
                  src="/logo192.png"
                  alt="User Avatar"
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: "#388e3c",
                    objectFit: "contain",
                  }}
                  variant="rounded"
                />
                <Typography
                  variant="h5"
                  style={{ fontWeight: 800, color: "#333" }}
                >
                  {userName}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {userEmail}
                </Typography>
                <Button
                  onClick={handleToggleManagement}
                  style={{
                    background: isManaging ? "#f44336" : "#1976d2",
                    borderRadius: 8,
                    marginTop: "8px",
                    color: "white",
                  }}
                >
                  {isManaging ? "Fechar Gerenciamento" : "Gerenciar Conta"}
                </Button>
              </Stack>
            </Card>

            {/* SEÇÃO DE GERENCIAMENTO (EXIBIÇÃO CONDICIONAL) */}
            {isManaging && (
              <Card
                elevation={4}
                style={{
                  padding: 24,
                  borderRadius: 16,
                  background: "rgba(255, 255, 255, 0.95)",
                }}
              >
                <Stack spacing={2}>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: 700, color: "#333" }}
                  >
                    Gerenciamento
                  </Typography>

                  <Button
                    onClick={() => setShowUsernameModal(true)} // AÇÃO: Abre o modal de alteração de nome
                    style={{ justifyContent: "flex-start", color: "#388e3c" }}
                  >
                    Alterar Nome de Usuário
                  </Button>
                  <Button
                    style={{ justifyContent: "flex-start", color: "#388e3c" }}
                  >
                    Alterar Foto de Perfil
                  </Button>
                  <Button
                    style={{ justifyContent: "flex-start", color: "#1976d2" }}
                  >
                    Alterar Senha
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleLogout}
                    style={{
                      background: "#f44336",
                      borderRadius: 8,
                      color: "white",
                    }}
                  >
                    Deslogar
                  </Button>
                </Stack>
              </Card>
            )}

            {/* 2. RECEITAS FAVORITAS (EXIBIÇÃO CONDICIONAL) */}
            {!isManaging && (
              <Card
                elevation={4}
                style={{
                  padding: 24,
                  borderRadius: 16,
                  background: "rgba(255, 255, 255, 0.95)",
                }}
              >
                <Typography
                  variant="h5"
                  style={{
                    fontWeight: 700,
                    color: "#388e3c",
                    marginBottom: "16px",
                  }}
                >
                  Minhas Receitas Salvas
                </Typography>

                {error && <Typography color="error">{error}</Typography>}

                {favorites.length > 0 ? (
                  <Grid container spacing={3}>
                    {favorites.map((fav) => (
                      <Grid item xs={12} sm={6} md={4} key={fav.recipe_id}>
                        <Box sx={{ position: "relative" }}>
                          {/* BOTÃO DE REMOVER FAVORITO */}
                          <Fab
                            size="small"
                            color="error"
                            onClick={() => handleRemoveFavorite(fav.recipe_id)}
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              zIndex: 10,
                              width: 36,
                              height: 36,
                              minHeight: 36,
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </Fab>
                          {/* Card de Receita */}
                          <RecipeCard
                            recipe={{
                              id: fav.recipe_id,
                              title: fav.recipe_title,
                              image: fav.image,
                              usedIngredientCount: 5,
                              missedIngredientCount: 0,
                            }}
                          />
                          {/* Exibe o Rating abaixo do Card */}
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            style={{ marginTop: "8px" }}
                          >
                            <Typography
                              variant="caption"
                              style={{ fontWeight: 600 }}
                            >
                              Nota:{" "}
                              {fav.user_rating
                                ? fav.user_rating.toFixed(1)
                                : "N/A"}
                            </Typography>
                          </Stack>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    Você ainda não salvou nenhuma receita.
                  </Typography>
                )}
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMsg}
      />

      {/* MODAL DE ALTERAÇÃO DE NOME */}
      <Modal
        open={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
      >
        <UpdateUsernameModal
          currentUserId={currentUserId}
          currentEmail={userEmail}
          currentName={userName}
          onUpdateSuccess={handleUsernameUpdateSuccess} // Função de sucesso
          onClose={() => setShowUsernameModal(false)}
        />
      </Modal>
    </React.Fragment>
  );
};

export default Profile;
