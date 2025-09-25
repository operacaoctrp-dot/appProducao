import { createClient } from '@supabase/supabase-js'

let supabaseClient: any = null

export const useSupabase = () => {
  if (!supabaseClient && process.client) {
    const config = useRuntimeConfig()
    supabaseClient = createClient(
      config.public.supabaseUrl,
      config.public.supabaseKey
    )
  }
  
  return supabaseClient
}

export const useAuth = () => {
  const user = ref<any>(null)
  const loading = ref(false)
  const initialized = ref(false)
  
  const supabase = useSupabase()

  // Estado inicial do usuário
  onMounted(async () => {
    if (supabase) {
      try {
        loading.value = true
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        user.value = currentUser
        
        // Listener para mudanças de autenticação
        supabase.auth.onAuthStateChange((event: any, session: any) => {
          user.value = session?.user || null
        })
      } catch (error) {
        console.error('Erro ao verificar usuário:', error)
        user.value = null
      } finally {
        loading.value = false
        initialized.value = true
      }
    } else {
      initialized.value = true
    }
  })

  // Login com email e senha
  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { user: null, error: { message: 'Supabase não disponível' } }
    }

    try {
      loading.value = true
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      user.value = data.user
      return { user: data.user, error: null }
    } catch (error) {
      console.error('Erro no login:', error)
      return { user: null, error }
    } finally {
      loading.value = false
    }
  }

  // Registro com email e senha
  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      return { user: null, error: { message: 'Supabase não disponível' } }
    }

    try {
      loading.value = true
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) throw error

      return { user: data.user, error: null }
    } catch (error) {
      console.error('Erro no registro:', error)
      return { user: null, error }
    } finally {
      loading.value = false
    }
  }

  // Logout
  const signOut = async () => {
    if (!supabase) {
      user.value = null
      await navigateTo('/login')
      return
    }

    try {
      loading.value = true
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      user.value = null
      await navigateTo('/login')
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    initialized: readonly(initialized),
    signIn,
    signUp,
    signOut
  }
}