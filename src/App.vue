<script setup lang="ts">
import { RouterView } from 'vue-router'
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
