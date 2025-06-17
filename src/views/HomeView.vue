<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Logo from '@/components/icons/logoIcon.vue';;
import PlayerSearch from '@/components/playerSearch.vue';
import FileUpload from '@/components/fileUpload.vue';
import type { ProfileData } from '@/replay/types/profile';
import { computed, onMounted } from 'vue';
import ProfileCard from '@/components/profileCard.vue';
import type { ReplayDropData } from '@/replay/types/replayDrop';
import ReplayCard from '@/components/replayCard.vue';
import InfoCard from '@/components/infoCard.vue';
import { useStatStore } from '@/stores/statFetch';
import { calculateCumulativeStats, combineStats, type PlayerCumulativeStats, type PlayerGameStats } from 'minomuncher-core';
import { useVisualize } from '@/stores/visualize';
import router from '@/router';
import { useUsernameStore } from '@/stores/username';
import type { LeagueResponse } from '@/replay/types/leagueRecord';
import { useCardData } from '@/stores/cardData';
import { storeToRefs } from 'pinia';
import { usePriorityTokenStore } from '@/stores/priorityToken';

const { cardData } = storeToRefs(useCardData())

const { replayStatus, fileStatus } = useStatStore()
const { setVisualize } = useVisualize()
const { username } = useUsernameStore()

const { priorityToken } = storeToRefs(usePriorityTokenStore())

onMounted(async () => {
  setVisualize({})
  if (username.length == 0) return
  if (cardData.value.some(x => 'username' in x && x.username === username)) {
    return
  }


  const resp = await fetch(`/api/user/${username.toLowerCase()}`, {
    headers: {
      supporter: priorityToken.value
    }
  })
  const txt = await resp.text()
  const js = JSON.parse(txt)
  const id = js["data"]["_id"]
  const avatarRev: number | undefined = js["data"]['avatar_revision']
  let userId: string | undefined

  if (typeof id === "string") {
    if (id.length > 0) {
      userId = id
    }
  }
  if (userId == undefined) {
    throw Error("no user id found")
  }
  try {
    const response = await fetch(`/api/league/${userId}`, {
      headers: {
        supporter: priorityToken.value
      }
    });
    const json: LeagueResponse = await response.json();

    if (json.error === undefined && json.success && json.data && json.data.entries.length != 0) {
      cardData.value.push(
        { checkedReplays: json.data.entries.map(x => x.replayid), response: json, userId, username: username, avatar: avatarRev ? `https://tetr.io/user-content/avatars/${userId}.jpg?rv=${avatarRev}` : undefined, avatarLoaded: false }
      )
    }
  } catch (error) {
    console.error(error);
  }
})

const dryCalculateVisualize = computed(() => {
  for (const data of cardData.value) {
    if (isProfileData(data)) {
      for (const rep of data.response.data!.entries) {
        let found = false
        for (const r of data.checkedReplays) {
          if (r == rep.replayid) {
            found = true
            break;
          }
        }
        if (!found) {
          continue
        }
        const status = replayStatus(rep.replayid)
        if (typeof status == "object") {
          for (const key in status) {
            if (key != data.userId) {
              continue
            }
            return true
          }
        }
      }
    } else {
      const status = fileStatus(data.dataHash)
      if (typeof status == "object") {
        for (const key in status) {
          let found = false
          for (const r of data.checkedUsers) {
            if (r == key) {
              found = true
              break;
            }
          }
          if (!found) {
            continue
          }
          return true
        }
      }
    }
  }
  return false
})


function calculateVisualize() {
  const newStats: PlayerGameStats = {}
  for (const data of cardData.value) {
    if (isProfileData(data)) {
      for (const rep of data.response.data!.entries) {
        let found = false
        for (const r of data.checkedReplays) {
          if (r == rep.replayid) {
            found = true
            break;
          }
        }
        if (!found) {
          continue
        }
        const status = replayStatus(rep.replayid)
        if (typeof status == "object") {
          for (const key in status) {
            if (key != data.userId) {
              continue
            }
            if (key in newStats) {
              combineStats(newStats[key].stats, status[key].stats)
            } else {
              newStats[key] = structuredClone(status[key])
            }
          }
        }
      }
    } else {
      const status = fileStatus(data.dataHash)
      if (typeof status == "object") {
        for (const key in status) {
          let found = false
          for (const r of data.checkedUsers) {
            if (r == key) {
              found = true
              break;
            }
          }
          if (!found) {
            continue
          }
          if (key in newStats) {
            combineStats(newStats[key], status[key])
          } else {
            newStats[key] = structuredClone(status[key])
          }
        }
      }
    }
  }
  const cumulativeStats: PlayerCumulativeStats = {}
  for (const key in newStats) {
    cumulativeStats[key] = { stats: calculateCumulativeStats(newStats[key].stats), username: newStats[key].username }
  }
  setVisualize(cumulativeStats)
  if (Object.keys(cumulativeStats).length == 0) return
  router.push({ path: '/stats' })
}

function updateCheckedUsers(dataHash: string, checkedUsers: string[]) {
  for (const x of cardData.value) {
    if (!isProfileData(x) && x.dataHash == dataHash) {
      x.checkedUsers = checkedUsers
      break
    }
  }
}

function updateCheckedReplays(userId: string, checkedReplays: string[]) {
  for (const x of cardData.value) {
    if (isProfileData(x) && x.userId == userId) {
      x.checkedReplays = checkedReplays
      break
    }
  }
}

function isProfileData(card: ProfileData | ReplayDropData): card is ProfileData {
  return (card as ProfileData).username !== undefined;
}

async function reloadCard(card: ProfileData) {
  cardData.value = cardData.value.filter(x => !isProfileData(x) || x.userId != card.userId)
  const userId: string = card.userId
  try {
    const response = await fetch(`/api/league/${userId}`, {
      headers: {
        supporter: priorityToken.value
      }
    });
    const json: LeagueResponse = await response.json();

    if (json.error === undefined && json.success && json.data && json.data.entries.filter(x => !x.stub).length != 0) {
      card.response = json
      card.checkedReplays = json.data.entries.map(x => x.replayid)
    }
  } catch (error) {
  }
  cardData.value = [card, ...cardData.value]
}

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
            <RouterLink to="/supporter" class="awesomeLink">Go Pro</RouterLink>
          </nav>
        </div>
      </header>
      <FileUpload :cards="cardData" @fileUpload="(files) => {
        cardData = [...files, ...cardData]
      }" />
      <div style="min-height: 50px;">
        <button class="goodButton" style="border-right: 1px solid var(--f_low);" @click="calculateVisualize()"
          v-if="dryCalculateVisualize">open all stats</button>
        <button @click="cardData = []" v-if="cardData.length > 0">clear all</button>
      </div>
    </div>

    <div style="display: flex; flex-direction: column;">
      <div>
        <PlayerSearch :cards="cardData" @response="(resp) => {
          cardData.unshift(resp)
        }" />
      </div>
      <TransitionGroup class="cardContainer" tag="div" name="list">
        <InfoCard v-if="cardData.length == 0" />
        <template v-for="card of cardData">
          <ProfileCard v-if="isProfileData(card)" v-show="card.avatarLoaded" :key="card.userId" :data="card"
            @profileLoad="() => {
              card.avatarLoaded = true
            }" @exit="() => {
              cardData = cardData.filter(x => !isProfileData(x) || x.userId != card.userId)
            }" @checked-replays="(y) => {
              updateCheckedReplays(card.userId, y)
            }" @reload="reloadCard(card)" />
          <ReplayCard v-else :key="card.dataHash" :data="card" @exit="() => {
            cardData = cardData.filter(x => isProfileData(x) || x.dataHash != card.dataHash)
          }" @checked-users="(y) => updateCheckedUsers(card.dataHash, y)" />
        </template>

      </TransitionGroup>
    </div>

  </div>

</template>

<style scoped>
button {
  background: none;
  color: inherit;
  border: none;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  color: var(--f_low);
}

button:hover {
  color: var(--f_high);
}

button:active {
  color: var(--f_med);
}

.goodButton {
  color: var(--rainbow_teal);
}

.goodButton:hover {
  color: var(--rainbow_green);
}

.goodButton:active {
  color: var(--f_high);
}

.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}

*::-webkit-scrollbar {
  display: none;
}

* {
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.cardContainer {
  width: 300px;
  height: 400px;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  mask-image: linear-gradient(transparent, #000 5%, #000 95%, transparent);
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

.awesomeLink {
  color: var(--rainbow_orange);
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
