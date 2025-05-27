import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUsernameStore = defineStore('username', () => {
  const username = ref('')
  function setUsername(newName: string) {
    username.value = newName
  }
  return { username, setUsername }
}, { persist: true })
