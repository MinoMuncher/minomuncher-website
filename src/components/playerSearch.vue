<template>
  <div style="display: flex; flex-direction: row; align-items: center; margin-left: 10px;">
    <input type="text" v-on:blur="onUsernameExit" v-on:keyup.enter="onUsernameSubmit" v-model="usernameInput"
      v-bind:class="{ loading: submittingUsername.length > 0 }" v-bind:disabled="submittingUsername.length > 0"
      placeholder="add league name..." />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const usernameInput = ref("")
const submittingUsername = ref("")
function onUsernameExit() {
  usernameInput.value = submittingUsername.value
}
function onUsernameSubmit() {
  submittingUsername.value = usernameInput.value
  if (submittingUsername.value == "") return
  fetch(`/api/proxy?username=${submittingUsername.value.toLowerCase()}`)
    .then(x => x.json())
    .then(console.log)
}
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

.loading {
  color: var(--f_low);
}
</style>
