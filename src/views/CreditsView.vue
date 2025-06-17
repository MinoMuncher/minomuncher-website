<script setup lang="ts">
import LogoIcon from '@/components/icons/logoIcon.vue';
import { onMounted, ref } from 'vue';

const DONORS = [
  "Mireu you are amazing!",
  "Jed you are awesome!",
  "Moose you are the GOAT!",
  "<3 Beyeet",
  "TYSM Andrew!",
  "Appreciate you Baron!",
  "You the best Mewk!",
  "<3 Skyfire",
  "SWNG!!!",
  "ORZ ORZ",
  "TY Kerr",
  "TY Nancy!"
]

const currentDonor = ref(DONORS[0])

function newCurrentDonor(): string {
  const lastText = currentDonor.value
  let newText = lastText
  while (newText == lastText) {
    newText = DONORS[Math.floor(Math.random() * DONORS.length)]
  }
  return newText
}

onMounted(() => {
  currentDonor.value = newCurrentDonor()
})
</script>

<template>
  <main>
    <div style="display: flex; flex-direction: row; align-items: center;">
      <div style="width: 50%; display: flex; flex-direction: row; justify-content: flex-end;">
        <div class="logoWrapper" @click="currentDonor = newCurrentDonor()">
          <LogoIcon></LogoIcon>
        </div>
      </div>
      <div style="width: 50%;">
        <p style="margin: 0;">Minomuncher says...</p>
        <p style="margin: 0;color: var(--rainbow_pink)" v-text="currentDonor"></p>
      </div>
    </div>
    <p>
      <em>THANK YOU TO MY DONORS: </em>
      <b style="color: var(--rainbow_red)">Mireu
        <a href="https://www.twitch.tv/puzzlekingdom" target="_blank">Moose </a>
        <a href="https://www.twitch.tv/puzzlekingdom" target="_blank">Jed </a>
        <a href="https://www.twitch.tv/mewk___" target="_blank">Mewk </a>
        <a href="https://x.com/skyfire_tetris" target="_blank">Skyfire </a>
        <a href="https://www.instagram.com/baronc.cc" target="_blank">Baron </a>
        Nancy
      </b>
      <b style="color: var(--rainbow_orange)">
        swng
      </b>
      <b style="color: var(--rainbow_yellow)">
        <a href="https://www.twitch.tv/pokimane" target="_blank">Andrew</a>
        Orz
        Kerr
        Beyeet
      </b>
    </p>
    <p>
      Minomuncher was originally created by Frey and CSDOTNET.
      It was then further maintained by CSDOTNET for a while, but was transferred back to Frey.
      Frey then updated the bot with the help of Halp.
      Minomuncher thanks the cooperation of the <em>Tetr.io</em> team with development!
    </p>
    <p style="text-align: center;">
      <RouterLink style="color: var(--rainbow_red)" to="/">Go Home</RouterLink>
    </p>
  </main>
</template>

<style lang="css" scoped>
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
