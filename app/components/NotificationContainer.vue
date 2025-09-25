<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup
      name="notification"
      tag="div"
      class="space-y-2"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'max-w-sm rounded-lg shadow-lg p-4 text-white',
          {
            'bg-green-500': notification.type === 'success',
            'bg-red-500': notification.type === 'error',
            'bg-yellow-500': notification.type === 'warning',
            'bg-blue-500': notification.type === 'info'
          }
        ]"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium">{{ notification.message }}</p>
          <button
            @click="removeNotification(notification.id)"
            class="ml-4 text-white hover:text-gray-200 transition-colors"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

const { notifications, removeNotification } = useNotification()
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>