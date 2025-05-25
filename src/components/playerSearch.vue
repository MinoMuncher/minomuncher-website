<template>
  <div style="display: flex; flex-direction: row; align-items: center; margin-left: 10px;">
    <input type="text" v-model="usernameInput" placeholder="add league name..." />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const usernameInput = ref("")

</script>


<style lang="css" scoped>
input {
  display: block;
  background: transparent;
  color: var(--f_high);
  font-size: 24px;
  border: none;
  max-width: 300px;
  outline: none;
  border-bottom: 2px solid var(--f_low);
  border-radius: 5px;
}
</style>
