import { ref } from 'vue'
import { defineStore } from 'pinia'

export const CURRENT_REPLAY_VERSION = '0.1' //todo: implement in build process

export const useVersionStore = defineStore('version', () => {
  const version = ref('0.0')
  function setVersion(v: string) {
    version.value = v
  }
  return { version, setVersion }
}, { persist: true })
