const BASE_URL = "https://api.spoonacular.com";
const API_KEY = 'AIzaSyDhdUcFNsTLPkd_R0Cawz0ZlopO_DGKYeU';

const RecipeAPI = {
  // Busca receitas na API usando uma lista de ingredientes.
  searchByIngredients: async (ingredients) => {
    if (!API_KEY) {
      throw new Error("Chave da API não configurada.");
    }

    // Converte a lista de ingredientes em um formato aceito pela Spoonacular (separado por vírgulas)
    const ingredientList = ingredients.join(",");
    const url = `${BASE_URL}/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredientList}&number=10`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Erro na busca de receitas: Status ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar receitas na Spoonacular:", error);
      throw error;
    }
  },

  // Busca ingredientes sugeridos pela API usando o autocompletar.
  searchIngredientsAutocomplete: async (query) => {
    if (!API_KEY) {
      throw new Error("Chave da API não configurada.");
    }

    const url = `${BASE_URL}/food/ingredients/autocomplete?apiKey=${API_KEY}&query=${query}&number=20`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Erro na busca de ingredientes: Status ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar ingredientes na Spoonacular:", error);
      throw error;
    }
  },

  // Busca os detalhes completos de uma receita usando seu ID.
  getRecipeDetails: async (recipeId) => {
    if (!API_KEY) {
      throw new Error("Chave da API não configurada.");
    }

    const url = `${BASE_URL}/recipes/${recipeId}/information?apiKey=${API_KEY}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Erro na busca de detalhes: Status ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Erro ao buscar detalhes da receita na Spoonacular:",
        error
      );
      throw error;
    }
  },
};

export default RecipeAPI;
