import { supabase } from "./SupabaseClient";

// Função auxiliar busca dados de forma genérica
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
  // Funções de manipulação de dados CRUD
  create: async (table, data) => {
    return await supabase.from(table).insert([data]).select();
  },
  update: async (table, data, id) => {
    return await supabase.from(table).update(data).eq("id", id).select();
  },
  delete: async (table, id) => {
    return await supabase.from(table).delete().eq("id", id).select();
  },

  // Busca apenas um registro
  find: async (table, id) => {
    const { data, error } = await list(table, { id: id }, 1);
    if (error) {
      return null;
    }
    return data ? data[0] : null;
  },

  // Implementação da busca de ingredientes traduzidos
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

  // FUNÇÕES DE FAVORITOS (mantidas)
  isFavorited: async (userId, recipeId) => {
    const { data, error } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("recipe_id", recipeId)
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
        .eq("user_id", userId)
        .eq("recipe_id", recipeId);

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

  // FUNÇÃO PARA SALVAR/ATUALIZAR CLASSIFICAÇÃO COM COMENTÁRIO
  saveRating: async (userId, recipeId, ratingValue, comment = null) => {
    const tableName = "recipe_ratings";

    // Converte o recipeId para NUMBER no início
    const numericRecipeId = Number(recipeId);

    // CORRIGIDO: Nome da coluna alterado para 'comment' (conforme a tabela)
    const updateData = { ratingValue: ratingValue, comment: comment };

    // 1. Tenta ATUALIZAR a classificação se ela já existir
    const { data, error: updateError } = await supabase
      .from(tableName)
      .update(updateData)
      .match({ user_id: userId, recipe_id: numericRecipeId }) // Uso do .match para robustez
      .select();

    if (updateError && updateError.code !== "PGRST116") {
      throw updateError;
    }

    // 2. Se nenhuma linha foi atualizada (não existia), CRIA o novo rating
    if (!data || data.length === 0) {
      const dataToSave = {
        user_id: userId,
        recipe_id: numericRecipeId,
        ratingValue: ratingValue,
        comment: comment, // CORRIGIDO: Nome da coluna
      };
      const { error: createError } = await Database.create(
        tableName,
        dataToSave
      );
      if (createError) throw createError;
    }

    return true;
  },

  // Funções não implementadas (mantidas)
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
