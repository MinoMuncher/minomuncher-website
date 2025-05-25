<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Logo from '@/components/logoIcon.vue';
import ProfileCard from '@/components/profileCard.vue';
import PlayerSearch from '@/components/playerSearch.vue';
import FileUpload from '@/components/fileUpload.vue';
import ReplayCard from '@/components/replayCard.vue';
import { DemoResponse } from '@/replay/types';
</script>

<template>
  <div id="homeWrapper">
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px">
      <header>
        <div class="logoWrapper">
          <Logo />
        </div>
        <div class="wrapper">
          <nav>
            <RouterLink to="/about">About</RouterLink>
            <RouterLink to="/credits">Credits</RouterLink>
          </nav>
        </div>
      </header>
      <FileUpload></FileUpload>
    </div>

    <div style="display: flex; flex-direction: column;">
      <div>
        <PlayerSearch></PlayerSearch>
      </div>
      <div class="profileContainer">
        <ReplayCard :replayName="'replay.ttrm'" :usernames="['fred', 'ryan', 'fedewa']" />
        <ProfileCard :username="'freyhoe'" :records="DemoResponse.data!.entries"></ProfileCard>
      </div>
    </div>

  </div>

</template>

<style scoped>
*::-webkit-scrollbar {
  display: none;
}

* {
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.profileContainer {
  width: 300px;
  height: 400px;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 340px;
  mask-image: linear-gradient(transparent, #000 5%, #000 80%, transparent);
}

.navButton {
  border: none;
  background: transparent;
}

.navButton * {
  fill: var(--f_high);
}

.logoWrapper {
  height: 150;
  width: 150;
}

.logoWrapper * {
  transition: transform 0.3s ease;
}

.logoWrapper:hover * {
  transform: scale(1.1);
}

#homeWrapper {
  display: flex;
  flex-direction: row;
}

header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
  place-items: center;
}

nav {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 1rem;
  text-align: left;
  margin-top: 1rem;
}

header .wrapper {
  display: flex;
  place-items: flex-start;
  flex-wrap: wrap;
}

nav a:hover {
  color: var(--f_high);
  background-color: var(--b_med);
}

nav a {
  transition: background-color 0.3s ease, color 0.3s ease;
  text-decoration: none;
  color: var(--f_low);
  display: inline-block;
  margin-left: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-left: 1px solid var(--f_low);
}
</style>
