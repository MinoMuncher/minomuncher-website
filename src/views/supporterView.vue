<script setup lang="ts">
import LogoIcon from '@/components/icons/logoIcon.vue';
import { usePriorityTokenStore } from '@/stores/priorityToken';
import { onMounted, ref } from 'vue';
const { priorityToken, setPriorityToken } = usePriorityTokenStore()
const isSupporter = ref(false)
const loading = ref(true)

const priorityTokenInput = ref(priorityToken)
function onTokenSubmit() {
  setPriorityToken(priorityTokenInput.value)
  checkAuth()
}

function checkAuth() {
  loading.value = true
  fetch(`/api/supporter/${priorityTokenInput.value}`, {
    headers: {
      supporter: priorityToken
    }
  }).then(x => {
    isSupporter.value = x.ok
  }).finally(() => loading.value = false)
}

onMounted(() => {
  checkAuth()
})


</script>

<template>
  <main>
    <div style="display: flex; flex-direction: row; align-items: center;">
      <div style="width: 100%; display: flex; flex-direction: row; justify-content: center;">
        <div class="logoWrapper">
          <LogoIcon></LogoIcon>
        </div>
      </div>
    </div>
    <template v-if="!loading">
      <template v-if="!isSupporter">
        <p>
          If you supported minomuncher's original indiegogo, enter your supporter token here:
        </p>
        <input v-model="priorityTokenInput" v-on:blur="onTokenSubmit" v-on:keyup.enter="onTokenSubmit"
          placeholder="example token...">
      </template>
      <p v-else>
        Thank you for being a supporter!
      </p>
    </template>
    <p style="text-align: center;">
      <RouterLink style="color: var(--rainbow_red)" to="/">Go Home</RouterLink>
    </p>
  </main>
</template>

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

.logoWrapper {
  height: 150;
  width: 150;
}

.logoWrapper * {
  transition: transform 0.3s ease;
}

.logoWrapper:hover * {
  transform: rotate(360deg)
}

.logoWrapper:active * {
  transform: scale(1.2)
}

main {
  font-family: Arial, sans-serif;
  color: var(--f_high);
  padding: 2rem;
  line-height: 1.6;
  max-width: 800px;
  margin: auto;

  font-family: "Martel", serif;
  font-weight: 700;
  font-style: normal;
  font-size: 24px;

}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

b a {
  text-decoration: underline;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  div[style*="display: flex"] {
    flex-direction: column !important;
    align-items: center !important;
    gap: 1rem;
  }

  .logoWrapper {
    height: 120px;
    width: 120px;
  }

  div[style*="width: 50%"] {
    width: 100% !important;
    text-align: center;
  }
}
</style>
