
import type { ProfileData } from "@/replay/types/profile"
import type { ReplayDropData } from "@/replay/types/replayDrop"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useCardData = defineStore('cardData', () => {
  const cardData = ref<(ProfileData | ReplayDropData)[]>([])
  return { cardData }
}, { persist: true })
