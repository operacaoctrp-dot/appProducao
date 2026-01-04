import { createClient } from "@supabase/supabase-js";

let supabaseClient: any = null;

export const useSupabase = () => {
  if (!supabaseClient && process.client) {
    const config = useRuntimeConfig();
    supabaseClient = createClient(
      config.public.supabaseUrl,
      config.public.supabaseKey
    );
  }

  return supabaseClient;
};

// Estados globais persistentes com localStorage como backup
const globalUser = ref<any>(null);
const globalLoading = ref(false);
const globalInitialized = ref(false);
let authListenerSetup = false;

// Salvar/carregar estado do localStorage para persistir durante mudanças de orientação
const saveAuthState = () => {
  if (process.client && globalUser.value) {
    localStorage.setItem("auth_user", JSON.stringify(globalUser.value));
    localStorage.setItem("auth_initialized", "true");
  }
};

const loadAuthState = () => {
  if (process.client) {
    const savedUser = localStorage.getItem("auth_user");
    const savedInitialized = localStorage.getItem("auth_initialized");

    if (savedUser) {
      try {
        globalUser.value = JSON.parse(savedUser);
      } catch (e) {
        console.warn("Erro ao carregar usuário do localStorage:", e);
      }
    }

    if (savedInitialized === "true") {
      globalInitialized.value = true;
    }
  }
};

export const useAuth = () => {
  const supabase = useSupabase();

  // Estado inicial do usuário - só executa uma vez
  onMounted(async () => {
    // Carregar estado persistido primeiro
    loadAuthState();

    // Se já foi inicializado, não faz nada
    if (globalInitialized.value) {
      return;
    }

    if (supabase && !authListenerSetup) {
      try {
        console.log("Inicializando autenticação...");
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        globalUser.value = currentUser;
        saveAuthState();

        // Listener para mudanças de autenticação - só configura uma vez
        supabase.auth.onAuthStateChange((event: any, session: any) => {
          console.log("Auth state changed:", event);
          globalUser.value = session?.user || null;
          saveAuthState();

          // Limpar localStorage se fez logout
          if (!session?.user) {
            localStorage.removeItem("auth_user");
          }
        });

        authListenerSetup = true;
      } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        globalUser.value = null;
      } finally {
        globalInitialized.value = true;
        saveAuthState();
        console.log("Autenticação inicializada");
      }
    } else {
      globalInitialized.value = true;
    }
  });

  // Login com email e senha
  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { user: null, error: { message: "Supabase não disponível" } };
    }

    try {
      globalLoading.value = true;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      globalUser.value = data.user;
      return { user: data.user, error: null };
    } catch (error) {
      console.error("Erro no login:", error);
      return { user: null, error };
    } finally {
      globalLoading.value = false;
    }
  };

  // Registro com email e senha
  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      return { user: null, error: { message: "Supabase não disponível" } };
    }

    try {
      globalLoading.value = true;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      console.error("Erro no registro:", error);
      return { user: null, error };
    } finally {
      globalLoading.value = false;
    }
  };

  // Logout
  const signOut = async () => {
    try {
      globalLoading.value = true;

      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }

      globalUser.value = null;
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_initialized");
      authListenerSetup = false;

      // Navegar para login
      await navigateTo("/login");
    } catch (error) {
      console.error("Erro no logout:", error);
      // Mesmo com erro, limpar dados locais e redirecionar
      globalUser.value = null;
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_initialized");
      authListenerSetup = false;
      await navigateTo("/login");
    } finally {
      globalLoading.value = false;
    }
  };

  return {
    user: readonly(globalUser),
    loading: readonly(globalLoading),
    initialized: readonly(globalInitialized),
    signIn,
    signUp,
    signOut,
  };
};
