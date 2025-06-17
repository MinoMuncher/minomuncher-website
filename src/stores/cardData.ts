
import type { ProfileData } from "@/replay/types/profile"
import type { ReplayDropData } from "@/replay/types/replayDrop"
import { defineStore } from "pinia"
import { ref, triggerRef } from "vue"

export const useCardData = defineStore('cardData', () => {
  const cardData = ref<(ProfileData | ReplayDropData)[]>([])
  function reset() {
    cardData.value = []
    triggerRef(cardData)
  }
  return { cardData, reset }
}, { persist: true })
