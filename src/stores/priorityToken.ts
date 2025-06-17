import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePriorityTokenStore = defineStore('priorityToken', () => {
  const priorityToken = ref('')
  function setPriorityToken(newName: string) {
    priorityToken.value = newName
  }
  return { priorityToken, setPriorityToken }
}, { persist: true })
