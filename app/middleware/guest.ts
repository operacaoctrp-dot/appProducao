export default defineNuxtRouteMiddleware(() => {
  // Só executa no lado do cliente
  if (process.server) return

  const { user, initialized } = useAuth()
  
  // Só redireciona se a autenticação já foi inicializada e há um usuário logado
  if (initialized.value && user.value) {
    return navigateTo('/')
  }
})