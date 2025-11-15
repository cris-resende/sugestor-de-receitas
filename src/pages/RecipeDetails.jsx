import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Card,
  Typography,
  Stack,
  Button,
  Rating,
  Snackbar,
  Fab,
  TextField,
} from "../components";
import RecipeAPI from "../services/RecipeAPI";
import Database from "../services/Database";
import { supabase } from "../services/SupabaseClient"; // Para obter o usuário logado

const RecipeDetails = () => {
  const { recipeId } = useParams();

  // ESTADOS
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  // NOVO ESTADO: Armazena o ID real do usuário logado
  const [currentUserId, setCurrentUserId] = useState(null);

  // Função para salvar (ou remover) a receita como favorita
  const handleToggleFavorite = async () => {
    if (!currentUserId) return;

    try {
      // Lógica de CREATE/DELETE, usando o ID real
      const isFav = await Database.toggleFavorite(
        currentUserId,
        Number(recipeId),
        recipe.title,
        isFavorited
      );

      setIsFavorited(isFav);
      setSnackbarMsg(
        isFav
          ? "Receita salva com sucesso!"
          : "Receita removida dos seus favoritos."
      );
    } catch (err) {
      setSnackbarMsg("Erro ao salvar favorito.");
    } finally {
      setShowSnackbar(true);
    }
  };

  // Função para lidar com a classificação por estrelas e comentário
  const handleRatingChange = async (newValue) => {
    if (!currentUserId) return; // Garante que o usuário esteja logado

    // Usa a nota atual se for clique no botão
    const ratingValue =
      newValue === null || newValue === 0 ? userRating : newValue;

    setUserRating(ratingValue);

    // Salva imediatamente se a nota for alterada nas estrelas
    if (ratingValue > 0) {
      try {
        // Usa o ID real para salvar o rating
        await Database.saveRating(
          currentUserId,
          Number(recipeId),
          ratingValue,
          userComment
        );

        setSnackbarMsg(`Classificação (${ratingValue} estrelas) salva!`);
      } catch (err) {
        setSnackbarMsg("Erro ao salvar a classificação.");
      } finally {
        setShowSnackbar(true);
      }
    }
  };

  // Função para salvar o comentário (chamada pelo onBlur e pelo botão)
  const handleSaveComment = async () => {
    if (userRating === 0) {
      setSnackbarMsg("Por favor, dê uma nota antes de salvar o comentário.");
      setShowSnackbar(true);
      return;
    }
    // Reutiliza o handleRatingChange com a nota existente
    await handleRatingChange(userRating);
  };

  // Lógica para buscar os detalhes completos da receita
  const fetchRecipeDetails = async () => {
    if (!recipeId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await RecipeAPI.getRecipeDetails(recipeId);
      setRecipe(data);

      // Obtém o usuário logado para buscas condicionais
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;
      setCurrentUserId(userId);

      // Se o usuário estiver logado, verifica se a receita está favoritada
      if (userId) {
        const isFav = await Database.isFavorited(userId, Number(recipeId));
        setIsFavorited(isFav);
      }
    } catch (err) {
      setError("Não foi possível carregar os detalhes desta receita.");
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para carregar os dados ao montar o componente
  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId]);

  // Função auxiliar para limpar o HTML (modo de preparo da Spoonacular)
  const cleanHtml = (html) => {
    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // --- Renderização de Estados de Carregamento/Erro ---
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
        <Typography variant="h6">Carregando detalhes da receita...</Typography>
      </Grid>
    );
  }

  if (error || !recipe) {
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
        <Typography variant="h6" color="error">
          Erro: {error || "Receita não encontrada."}
        </Typography>
      </Grid>
    );
  }

  const instructions = cleanHtml(recipe.instructions || recipe.summary);

  // --- Renderização Principal (Mobile-First Moderno) ---
  return (
    // Fragmento para envolver o Grid e o Snackbar
    <>
      <Grid
        container
        justifyContent="center"
        style={{
          // Fundo temático
          background: "linear-gradient(135deg, #e0f2f7 0%, #c4e0e8 100%)",
          padding: "16px 8px",
        }}
      >
        <Grid item xs={12} sm={10} md={8}>
          <Stack
            spacing={3}
            style={{ paddingTop: "16px", paddingBottom: "32px" }}
          >
            {/* 1. TÍTULO E FAVORITAR */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h4"
                style={{
                  fontWeight: 800,
                  color: "#388e3c", // Cor temática
                  textAlign: "left",
                  flexGrow: 1,
                }}
              >
                {recipe.title}
              </Typography>

              {/* BOTÃO DE FAVORITAR */}
              <Fab
                color={isFavorited ? "secondary" : "primary"}
                aria-label="favorite"
                onClick={handleToggleFavorite}
                style={{
                  marginLeft: "16px",
                  minWidth: "56px",
                  // Cores temáticas
                  background: isFavorited ? "#F44336" : "#388e3c",
                }}
                disabled={!currentUserId} // Desabilita se o ID for nulo (não logado)
              >
                <Typography style={{ fontSize: "20px", color: "#fff" }}>
                  {isFavorited ? "★" : "☆"}
                </Typography>
              </Fab>
            </Stack>

            {/* 2. IMAGEM E TEMPO DE PREPARO (SEÇÃO DE METADADOS) */}
            <Card
              style={{
                padding: 0,
                borderRadius: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {/* Imagem principal */}
              <div
                style={{
                  height: "250px",
                  backgroundImage: `url(${recipe.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                }}
              />

              {/* Tempo de Preparo e Porções */}
              <Stack
                direction="row"
                justifyContent="space-around"
                style={{ padding: "12px", background: "#e3f2fd" }}
              >
                <Stack alignItems="center">
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: 700, color: "#1976d2" }}
                  >
                    {recipe.readyInMinutes} min
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Preparo
                  </Typography>
                </Stack>
                <Stack alignItems="center">
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: 700, color: "#1976d2" }}
                  >
                    {recipe.servings}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Porções
                  </Typography>
                </Stack>
              </Stack>
            </Card>

            {/* 3. CLASSIFICAÇÃO E COMENTÁRIO */}
            <Card
              style={{
                padding: 16,
                borderRadius: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <Stack spacing={2}>
                {/* RATING */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    style={{ fontWeight: 600 }}
                  >
                    Sua Nota:
                  </Typography>
                  <Rating
                    value={userRating}
                    precision={0.5}
                    onChange={(event, newValue) => handleRatingChange(newValue)}
                  />
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: 700, color: "#1976d2" }}
                  >
                    ({userRating})
                  </Typography>
                </Stack>

                {/* CAMPO DE COMENTÁRIO */}
                <TextField
                  label="Adicionar Comentário (Opcional)"
                  multiline
                  rows={2}
                  fullWidth
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  onBlur={() => handleSaveComment()}
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleSaveComment()}
                  disabled={userRating === 0}
                  style={{ marginTop: "8px" }}
                >
                  Salvar Classificação e Comentário
                </Button>
              </Stack>
            </Card>

            {/* 4. INGREDIENTES NECESSÁRIOS */}
            <Card
              style={{
                padding: 16,
                borderRadius: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="h5"
                style={{ fontWeight: 700, marginBottom: "16px" }}
              >
                Ingredientes
              </Typography>
              <Grid container spacing={2}>
                {recipe.extendedIngredients &&
                  recipe.extendedIngredients.map((ing, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <Typography
                          variant="body2"
                          style={{ fontWeight: 700, color: "#388e3c" }}
                        >
                          •
                        </Typography>
                        <Typography variant="body2">
                          {ing.amount} {ing.unit} de **{ing.nameClean}**
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
              </Grid>
            </Card>

            {/* 5. MODO DE PREPARO */}
            <Card
              style={{
                padding: 16,
                borderRadius: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="h5"
                style={{ fontWeight: 700, marginBottom: "16px" }}
              >
                Modo de Preparo
              </Typography>
              {instructions ? (
                <Typography
                  variant="body1"
                  style={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}
                >
                  {instructions}
                </Typography>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  Modo de preparo detalhado não disponível.
                </Typography>
              )}
            </Card>

            {/* Botão de Retorno */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => window.history.back()}
              style={{ marginTop: "16px" }}
            >
              Voltar para a Busca
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Snackbar para feedback */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMsg}
      />
    </>
  );
};

export default RecipeDetails;
