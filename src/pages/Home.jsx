import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
  Grid,
  TextField,
} from "../components";
import IngredientItem from "../components/custom/IngredientItem.jsx";
import RecipeCard from "../components/custom/RecipeCard.jsx";
import RecipeAPI from "../services/RecipeAPI";
import Database from "../services/Database";

const Home = () => {
  // ESTADOS
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  // LÓGICA: Adiciona ou remove o ingrediente selecionado (nome_en como chave)
  const handleIngredientClick = (nameKey) => {
    setSelectedIngredients((prevSelected) => {
      if (prevSelected.includes(nameKey)) {
        return prevSelected.filter((itemKey) => itemKey !== nameKey);
      }
      return [...prevSelected, nameKey];
    });
  };

  // LÓGICA: Dispara a busca de receitas na API da Spoonacular
  const handleSearchRecipes = async () => {
    const ingredientNames = selectedIngredients;

    setSearchResults([]);
    setIsLoading(true);

    try {
      const data = await RecipeAPI.searchByIngredients(ingredientNames);
      setSearchResults(data);
    } catch (err) {
      setError(
        "Não foi possível buscar as receitas. Verifique sua chave de API."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // FUNÇÃO: Carrega a lista de ingredientes traduzidos do Supabase
  const fetchInitialIngredients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Busca dados da tabela "ingredientes"
      const data = await Database.getTranslatedIngredients();

      // Mapeia para o formato de exibição (Nome PT para a tela, Nome EN para a chave)
      const mappedIngredients = data.map((ing) => {
        const nameLower = ing.nome_en.toLowerCase();
        return {
          id: ing.id,
          nameKey: nameLower,
          name: ing.nome_pt.charAt(0).toUpperCase() + ing.nome_pt.slice(1),
          icon: ing.nome_pt[0].toUpperCase(),
        };
      });

      setIngredientsList(mappedIngredients);
    } catch (err) {
      setError("Não foi possível carregar os ingredientes do banco de dados.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialIngredients();
  }, []);

  // VARIÁVEIS DE EXIBIÇÃO
  const isSearching = searchTerm.length > 0;
  const hasSelected = selectedIngredients.length > 0;
  const isReadyToSearch = !isLoading && hasSelected;

  // FILTRAGEM: Compara o termo de busca com o nome em PT
  const filteredIngredients = ingredientsList.filter((ing) =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica para definir quais ingredientes renderizar
  let ingredientsToDisplay = [];
  if (showAllIngredients) {
    ingredientsToDisplay = ingredientsList;
  } else if (isSearching) {
    ingredientsToDisplay = filteredIngredients;
  } else if (hasSelected) {
    // Se não está buscando e não clicou em 'Ver Todos', mostra apenas os selecionados
    ingredientsToDisplay = ingredientsList.filter((ing) =>
      selectedIngredients.includes(ing.nameKey)
    );
  }

  // Condição para mostrar o Card de Ingredientes
  const shouldShowIngredientList =
    showAllIngredients || isSearching || hasSelected;

  // --- RENDERIZAÇÃO ---
  return (
    <Grid
      container
      justifyContent="center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f2f7 0%, #c4e0e8 100%)",
        padding: "16px 8px",
      }}
    >
      <Grid item xs={12} sm={10} md={8}>
        <Stack
          spacing={3}
          alignItems="center"
          style={{ paddingTop: "16px", paddingBottom: "16px" }}
        >
          <Typography
            variant="h5"
            style={{ fontWeight: 800, color: "#388e3c", textAlign: "center" }}
          >
            O que você tem na geladeira?
          </Typography>

          {/* CAMPO DE BUSCA E BOTÃO "VER TODOS" */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            style={{ width: "100%" }}
          >
            <Card
              style={{
                padding: 16,
                borderRadius: 16,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                width: "100%",
              }}
            >
              <TextField
                label={`Pesquisar ingredientes... (${selectedIngredients.length} escolhidos)`}
                type="text"
                fullWidth
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.length > 0) setShowAllIngredients(false);
                }}
                disabled={isLoading}
                InputProps={{ style: { borderRadius: 10 } }}
                InputLabelProps={{ style: { color: "#388e3c" } }}
              />
            </Card>

            {/* BOTÃO DISCRETO PARA VER TODOS (FILTRO) */}
            <Button
              variant={showAllIngredients ? "contained" : "outlined"}
              color="primary"
              onClick={() => {
                setShowAllIngredients((prev) => !prev);
                setSearchTerm("");
              }}
              style={{
                height: "56px",
                minWidth: "auto",
                padding: "0 12px",
                fontSize: "12px",
                borderRadius: 10,
                backgroundColor: showAllIngredients ? "#388e3c" : "transparent",
                borderColor: "#388e3c",
                color: showAllIngredients ? "#fff" : "#388e3c",
              }}
              disabled={isLoading}
            >
              {showAllIngredients ? "Ocultar" : "Todos"}
            </Button>
          </Stack>

          {/* EXIBIÇÃO DE ESTADOS: Loading e Erro */}
          {isLoading && (
            <Typography style={{ textAlign: "center", padding: "20px 0" }}>
              Carregando banco de ingredientes...
            </Typography>
          )}
          {error && (
            <Typography
              color="error"
              style={{ textAlign: "center", padding: "20px 0", color: "red" }}
            >
              {error}
            </Typography>
          )}

          {/* CARD DA LISTA DE INGREDIENTES */}
          {!isLoading && shouldShowIngredientList && (
            <Card
              style={{
                padding: 16,
                borderRadius: 16,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                width: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                style={{ marginBottom: "16px", fontWeight: 600 }}
              >
                {isSearching
                  ? `Resultados para "${searchTerm}"`
                  : hasSelected
                  ? `Itens Selecionados (${selectedIngredients.length})`
                  : "Todos os Ingredientes"}
              </Typography>

              {/* LISTA DE INGREDIENTES */}
              {ingredientsToDisplay.length > 0 ? (
                <Grid container spacing={1}>
                  {ingredientsToDisplay.map((ingredient) => (
                    <Grid item xs={3} sm={2} key={ingredient.id}>
                      <IngredientItem
                        id={ingredient.id}
                        name={ingredient.name}
                        icon={ingredient.icon}
                        isSelected={selectedIngredients.includes(
                          ingredient.nameKey
                        )}
                        onClick={() =>
                          handleIngredientClick(ingredient.nameKey)
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography style={{ textAlign: "center", padding: "20px 0" }}>
                  {isSearching
                    ? `Nenhum ingrediente encontrado para "${searchTerm}".`
                    : "Sua lista de seleção está vazia."}
                </Typography>
              )}
            </Card>
          )}

          {/* Botão de Busca de Receitas */}
          <Button
            variant="contained"
            color="primary"
            style={{ width: "100%", marginBottom: "16px" }}
            onClick={handleSearchRecipes}
            disabled={!isReadyToSearch}
          >
            Buscar Receitas ({selectedIngredients.length})
          </Button>

          {/* SEÇÃO DE RESULTADOS DA BUSCA */}
          {searchResults.length > 0 && (
            <Card
              style={{
                padding: 16,
                borderRadius: 16,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                style={{ marginBottom: "16px", fontWeight: 600 }}
              >
                Receitas Encontradas ({searchResults.length})
              </Typography>

              {/* NOVO: Grid de Cards de Receitas */}
              <Grid container spacing={2}>
                {searchResults.map((recipe) => (
                  <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                    <RecipeCard recipe={recipe} />
                  </Grid>
                ))}
              </Grid>
            </Card>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Home;
