import type { PlayerCumulativeStats } from "minomuncher-core"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useVisualize = defineStore('visualize', () => {
  const visualize = ref<PlayerCumulativeStats>({})
  function setVisualize(newVis: PlayerCumulativeStats) {
    visualize.value = newVis
  }
  return { visualize, setVisualize }
}, { persist: true })
