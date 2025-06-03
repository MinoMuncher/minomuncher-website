<script setup lang="ts">
import LogoIcon from '@/components/logoIcon.vue';
import { onMounted, ref } from 'vue';

const TEXT_BLURBS = [
  "SNAIL", "Love you Fred", "Hello Marcus",
  "Nuketris4Life", "I miss you, Mister Vampire", "What is striding anyway",
  "Play Faster <3", "Learn pigeon opener!", "KOS might be peak",
  "Humans were not meant to go above 2pps", "Should TSMS count as allspins?", "Charlotte!!",
  "I love app farming", "Gone Fishing...", "Sankey graphs are weird",
  "Powered by d3!", "I wish SVGs embed everywhere", "PRIDE!",
  "Learn Rivi's Number One opener!", "Play cheese race!", "Powered by Vue.js!"
]

const textBlurb = ref(TEXT_BLURBS[0])

function newTextBlurb(): string {
  const lastText = textBlurb.value
  let newText = lastText
  while (newText == lastText) {
    newText = TEXT_BLURBS[Math.floor(Math.random() * TEXT_BLURBS.length)]
  }
  return newText
}

onMounted(() => {
  textBlurb.value = newTextBlurb()
})
</script>

<template>
  <main>
    <h1 style="color: var(--rainbow_yellow)">MinoMuncher</h1>
    <p>
      MinoMuncher is a tool that analyzes <em>TTRM</em> files to extrapolate more advanced stats than would
      normally be possible.
      Instead of looking at the few raw stats that a shallow analysis can provide, the bot simulates each game action by
      action, logging information about line clears, boards, and gamestates along the way.
    </p>
    <div style="display: flex; flex-direction: row; align-items: center;">
      <div style="width: 35%; display: flex; flex-direction: row; justify-content: flex-end;">
        <div class="logoWrapper" @click="textBlurb = newTextBlurb()">
          <LogoIcon></LogoIcon>
        </div>
      </div>
      <div style="width: 65%;">
        <p style="margin: 0;">Minomuncher says...</p>
        <p style="margin: 0;color: var(--rainbow_pink)" v-text="textBlurb"></p>
      </div>
    </div>
    <p>
      MinoMuncher is hosted at the Discord server:
      <a style="color: var(--rainbow_orange)" href="https://discord.gg/HQctjQXFmq"
        target="_blank">https://discord.gg/HQctjQXFmq</a>
    </p>
    <p>
      You can see some statistic demonstrations at <RouterLink style="color: var(--rainbow_green)" to="/stats">the stats
        page</RouterLink>
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

a {
  color: #0066cc;
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
