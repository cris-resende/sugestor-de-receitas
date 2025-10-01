import { supabase } from './SupabaseClient';

const Authentication = {
  register: async (email, password) => {
    try {
      const { user, session, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { user, session };
    } catch (error) {
      throw error;
    }
  },
  login: async (email, password) => {
    try {
      const { user, session, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { user, session };
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  },
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      throw error;
    }
  },
};
export default Authentication;