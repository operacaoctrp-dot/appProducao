export default defineNuxtRouteMiddleware((to) => {
  // Só executa no lado do cliente
  if (process.server) return

  const { user, initialized } = useAuth()
  
  // Lista de rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login']
  
  // Se está acessando uma rota pública, permite
  if (publicRoutes.includes(to.path)) {
    return
  }
  
  // Para rotas protegidas, verifica se está logado
  // Só redireciona se a autenticação já foi inicializada e não há usuário
  if (initialized.value && !user.value) {
    return navigateTo('/login')
  }
})