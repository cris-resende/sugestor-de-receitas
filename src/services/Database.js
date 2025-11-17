import { supabase } from "./SupabaseClient";

// Busca os dados de forma genérica
const list = async (table, filter, limit) => {
  let query = supabase.from(table).select("*");

  if (filter) {
    Object.keys(filter).forEach((key) => {
      query = query.eq(key, filter[key]);
    });
  }

  if (limit) {
    query = query.range(0, limit - 1);
  }

  return await query;
};

const Database = {
  // Manipulação de dados CRUD
  create: async (table, data) => {
    return await supabase.from(table).insert([data]).select();
  },
  update: async (table, data, id) => {
    return await supabase.from(table).update(data).eq("id", id).select();
  },
  delete: async (table, id) => {
    return await supabase.from(table).delete().eq("id", id).select();
  },

  find: async (table, id) => {
    const { data, error } = await list(table, { id: id }, 1);
    if (error) {
      return null;
    }
    return data ? data[0] : null;
  },

  // Busca de ingredientes traduzidos
  getTranslatedIngredients: async () => {
    const { data, error } = await supabase
      .from("ingredientes")
      .select("id, nome_pt, nome_en");

    if (error) {
      console.error("Error fetching translated ingredients:", error);
      throw error;
    }
    return data;
  },

  // Busca o rating específico de uma receita
  getSingleRecipeRating: async (userId, recipeId) => {
    const { data, error } = await supabase
      .from("recipe_ratings")
      .select("ratingValue, comment")
      .eq("user_id", userId)
      .eq("recipe_id", recipeId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching single rating:", error);
      throw error;
    }
    return data;
  },

  // Busca a lista básica de favoritos
  getUserFavorites: async (userId) => {
    const { data, error } = await supabase
      .from("user_favorites")
      .select("id, recipe_id, recipe_title")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user favorites:", error);
      throw error;
    }
    return data;
  },

  isFavorited: async (userId, recipeId) => {
    const { data, error } = await supabase
      .from("user_favorites")
      .select("id")
      .match({ user_id: userId, recipe_id: recipeId })
      .single();

    return data !== null;
  },

  toggleFavorite: async (
    userId,
    recipeId,
    recipeTitle,
    isCurrentlyFavorited
  ) => {
    const tableName = "user_favorites";

    if (isCurrentlyFavorited) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .match({ user_id: userId, recipe_id: recipeId });

      if (error) throw error;
      return false;
    } else {
      const dataToSave = {
        user_id: userId,
        recipe_id: recipeId,
        recipe_title: recipeTitle,
      };
      const { error } = await Database.create(tableName, dataToSave);

      if (error) throw error;
      return true;
    }
  },

  // Salva ou atualiza a classificação de uma receita
  saveRating: async (userId, recipeId, ratingValue, comment = null) => {
    const tableName = "recipe_ratings";
    const numericRecipeId = Number(recipeId);

    const updateData = { ratingValue: ratingValue, comment: comment };

    const { data, error: updateError } = await supabase
      .from(tableName)
      .update(updateData)
      .match({ user_id: userId, recipe_id: numericRecipeId })
      .select();

    if (updateError && updateError.code !== "PGRST116") {
      throw updateError;
    }

    if (!data || data.length === 0) {
      const dataToSave = {
        user_id: userId,
        recipe_id: numericRecipeId,
        ratingValue: ratingValue,
        comment: comment,
      };
      const { error: createError } = await Database.create(
        tableName,
        dataToSave
      );
      if (createError) throw createError;
    }

    return true;
  },

  list: async (table) => {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      console.error(`Error listing table ${table}:`, error);
      throw error;
    }
    return data;
  },
};

export default Database;
