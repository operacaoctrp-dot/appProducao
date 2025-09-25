type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: number
  message: string
  type: NotificationType
  duration: number
}

export const useNotification = () => {
  const notifications = ref<Notification[]>([])

  const addNotification = (message: string, type: NotificationType = 'info', duration: number = 5000) => {
    const id = Date.now()
    const notification: Notification = {
      id,
      message,
      type,
      duration
    }

    notifications.value.push(notification)

    // Auto remove após o duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number) => addNotification(message, 'success', duration)
  const error = (message: string, duration?: number) => addNotification(message, 'error', duration)
  const warning = (message: string, duration?: number) => addNotification(message, 'warning', duration)
  const info = (message: string, duration?: number) => addNotification(message, 'info', duration)

  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }
}