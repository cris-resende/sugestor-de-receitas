import { useState, useEffect } from "react";
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
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  //Adiciona ou remove o ingrediente selecionado
  const handleIngredientClick = (nameKey) => {
    setSelectedIngredients((prevSelected) => {
      if (prevSelected.includes(nameKey)) {
        return prevSelected.filter((itemKey) => itemKey !== nameKey);
      }
      return [...prevSelected, nameKey];
    });
  };

  //Dispara a busca de receitas na API da Spoonacular
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

  //Carrega a lista de ingredientes traduzidos do Supabase
  const fetchInitialIngredients = async () => {
    setIsLoading(true);
    setError(null);
    try {
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

  //Busca os ingredientes iniciais ao carregar o componente
  useEffect(() => {
    fetchInitialIngredients();
  }, []);

  const isSearching = searchTerm.length > 0;
  const hasSelected = selectedIngredients.length > 0;
  const isReadyToSearch = !isLoading && hasSelected;

  const filteredIngredients = ingredientsList.filter((ing) =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let ingredientsToDisplay = [];
  if (showAllIngredients) {
    ingredientsToDisplay = ingredientsList;
  } else if (isSearching) {
    ingredientsToDisplay = filteredIngredients;
  } else if (hasSelected) {
    ingredientsToDisplay = ingredientsList.filter((ing) =>
      selectedIngredients.includes(ing.nameKey)
    );
  }

  const shouldShowIngredientList =
    showAllIngredients || isSearching || hasSelected;

  const primaryColor = "#388e3c";
  const cardShadow = "0 4px 24px rgba(0,0,0,0.1)";

  const featureCardMaxWidth = "75%";

  const features = [
    {
      title: "Zero Desperdício e Máxima Economia",
      icon: "🛒",
      description:
        "Diga adeus àquela comida que estraga na gaveta! Nossa ferramenta faz a 'pesquisa de geladeira' por você, encontrando receitas que utilizam seus ingredientes de forma criativa, garantindo que você economize e evite o estresse de cozinhar sem inspiração.", // Descrição expandida e humanizada
      details: [
        "Seu planejamento de refeições começa aqui",
        "Cozinhe de forma inteligente",
        "Menos idas inesperadas ao mercado",
      ],
    },
    {
      title: "Seleção Rápida e Interativa",
      icon: "🔍",
      description:
        "Não perca tempo digitando. Encontre seus ingredientes usando a busca em tempo real ou filtre pela nossa lista de itens disponíveis. Com um simples clique, adicione ou remova itens para refinar sua lista e ver as sugestões imediatamente.", // NOVA DESCRIÇÃO
      details: [
        "Filtro inteligente em tempo real",
        "Feedback visual imediato ao clicar",
        "Lista reativa e sempre atualizada",
      ],
    },
    {
      title: "Salvar e Favoritar Receitas",
      icon: "⭐",
      description:
        "Crie seu perfil, favorite as receitas que você ama e retorne a elas quando quiser! Sua próxima refeição favorita estará a apenas um clique de distância.",
      details: [
        "Crie seu perfil",
        "Salve seus favoritos",
        "Recupere facilmente",
      ],
    },
  ];

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
      <Grid item xs={12} sm={10} md={10}>
        <Stack
          spacing={5}
          alignItems="center"
          style={{ paddingTop: "24px", paddingBottom: "32px" }}
        >
          {/*SEÇÃO DE TÍTULO PRINCIPAL E INTRODUÇÃO */}
          <Stack spacing={1} style={{ width: "100%", padding: "8px 0" }}>
            <Typography
              variant="h3"
              style={{
                fontWeight: 900,
                color: primaryColor,
                textAlign: "center",
                lineHeight: 1.1,
              }}
            >
              Transforme Ingredientes em Refeições Incríveis!
            </Typography>
            <Typography
              variant="subtitle1"
              style={{
                textAlign: "center",
                color: "#424242",
                padding: "0 8px",
                maxWidth: 600,
                margin: "auto",
                marginTop: 20,
              }}
            >
              Seu assistente de cozinha pessoal: cozinhe de forma inteligente,
              evite desperdícios e descubra novas receitas com o que você já tem
              em casa.
            </Typography>
          </Stack>

          {/*STACK DE CARTÕES DE FUNCIONALIDADES/BENEFÍCIOS */}
          <Stack
            spacing={4}
            alignItems="center"
            style={{
              width: "100%",
              padding: "16px 0",
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                style={{
                  backgroundColor: "#F0F8FB",
                  borderRadius: 16,
                  width: "100%",
                  maxWidth: featureCardMaxWidth,
                  boxShadow: cardShadow,
                  borderTop: `4px solid ${primaryColor}`,
                  transition: "transform 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent
                  style={{ padding: "20px", backgroundColor: "#F0F8FB" }}
                >
                  <Typography
                    variant="h4"
                    style={{
                      backgroundColor: "#F0F8FB",
                      fontSize: "32px",
                      textAlign: "center",
                    }}
                  >
                    {feature.icon}
                  </Typography>
                  <Typography
                    variant="h6"
                    style={{
                      backgroundColor: "#F0F8FB",
                      fontWeight: 700,
                      color: primaryColor,
                      textAlign: "center",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      backgroundColor: "#F0F8FB",
                      color: "#616161",
                      padding: "10px 0",
                      textAlign: "center",
                    }}
                  >
                    {feature.description}
                  </Typography>

                  <Stack
                    spacing={0.5}
                    style={{ paddingLeft: 20, backgroundColor: "#F0F8FB" }}
                  >
                    {" "}
                    {feature.details.map((detail, dIndex) => (
                      <Typography
                        key={dIndex}
                        variant="caption"
                        style={{
                          backgroundColor: "#F0F8FB",
                          color: "#424242",
                          fontSize: "14px",
                        }}
                      >
                        • {detail}
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {/* TÍTULO PRINCIPAL DA BUSCA */}
          <Typography
            variant="h5"
            style={{
              fontWeight: 800,
              color: primaryColor,
              textAlign: "center",
              paddingTop: "16px",
            }}
          >
            Selecione seus Ingredientes
          </Typography>

          {/* CAMPO DE BUSCA E BOTÃO "VER TODOS" */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            style={{ width: "75%" }}
          >
            <Card
              style={{
                padding: 16,
                borderRadius: 16,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                width: "100%",
                alignItems: "center",
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
                InputLabelProps={{ style: { color: primaryColor } }}
              />
            </Card>

            {/* BOTÃO DISCRETO PARA VER TODOS*/}
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
                backgroundColor: showAllIngredients
                  ? primaryColor
                  : "transparent",
                borderColor: primaryColor,
                color: showAllIngredients ? "#fff" : primaryColor,
              }}
              disabled={isLoading}
            >
              {showAllIngredients ? "Ocultar" : "Todos"}
            </Button>
          </Stack>

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
            style={{
              width: "75%",
              color: "black",
              marginBottom: "16px",
              backgroundColor: primaryColor,
              padding: "12px 0",
              borderRadius: 10,
            }}
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

              {/* Grid de Cards de Receitas */}
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
