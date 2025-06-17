<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { CURRENT_REPLAY_VERSION, useVersionStore } from './stores/version';
import { useStatStore } from './stores/statFetch';
import { useCardData } from './stores/cardData';

const versionStore = useVersionStore()
const statStore = useStatStore()
const cardData = useCardData()

onMounted(()=>{
  if (versionStore.version != CURRENT_REPLAY_VERSION) {
    versionStore.setVersion(CURRENT_REPLAY_VERSION)
    statStore.reset()
    cardData.reset()
  }
})

</script>

<template>
  <div id="appWrapper">
    <RouterView />
  </div>
</template>

<style scoped>
#appWrapper {
  display: grid;
  place-items: center;
  height: 100%;
}
</style>
