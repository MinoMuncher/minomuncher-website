<template>
  <div class="card">

    <h3 :style="{ color: defaultRainbow.teal }">Welcome</h3>
    <input @keydown="setUsername(defaultUsername)"
      :style="{ textAlign: defaultUsername.length > 0 ? 'center' : 'left' }" v-model="defaultUsername"
      placeholder="default username...">
    <p>Use the <em>file upload</em> and <em>username query</em> to start uploading replays.</p>
    <p><a href="https://discord.com/invite/HQctjQXFmq" target="_blank">discord</a> for questions and asks</p>
  </div>
</template>
<script setup lang="ts">
import { useUsernameStore } from '@/stores/username';
import { defaultRainbow } from '@/theme/colors';
import { ref } from 'vue';

const { username, setUsername } = useUsernameStore()

const defaultUsername = ref(username)
</script>
<style lang="css" scoped>
@import "@/assets/card.css";


em {
  color: var(--f_med);
}

a {
  color: var(--f_high);
  text-decoration: none;
}

.card {
  color: var(--f_high);
}

.card h3 {
  margin-bottom: 5px;
}

.card p {
  padding-left: 10px;
  padding-right: 10px;
  color: var(--f_low)
}

input {
  display: block;
  background: transparent;
  color: var(--f_high);
  border: none;
  font-size: 24px;
  width: 200px;
  outline: none;
  border-bottom: 2px solid var(--f_low);
  border-radius: 5px;
}
</style>
