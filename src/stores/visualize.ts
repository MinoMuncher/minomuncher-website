import { demoStats } from "@/replay/demo"
import { type Players, } from "@/replay/types/stats"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useVisualize = defineStore('visualize', () => {
  const visualize = ref<Players>(demoStats)
  function setVisualize(newVis: Players) {
    visualize.value = newVis
  }
  return { visualize, setVisualize }
}, { persist: true })
