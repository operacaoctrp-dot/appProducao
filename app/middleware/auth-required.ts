export default defineNuxtRouteMiddleware(() => {
  // Só executa no lado do cliente
  if (process.server) return

  const { user, initialized } = useAuth()
  
  // Se a autenticação foi inicializada e não há usuário, redireciona
  if (initialized.value && !user.value) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Acesso negado. Faça login para continuar.'
    })
  }
})