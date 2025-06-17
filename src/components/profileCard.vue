<template>
  <div :class="['card-container', flipped ? 'flipped' : '']" :style="{ width: `${300}px`, height: `${300}px` }">
    <div class="front">
      <slot name="front">
        <div class="card">
          <button class="flipButton fade-in" @click="flip">
            <FlipIcon />
          </button>
          <button v-if="checkedCount" class="openStatsLink" @click="openStats"
            style="position: absolute; top:20px; left: 50%; transform: translateX(-50%); z-index: 3">Open Stats</button>
          <CloseIcon class="icon" style="position: absolute; top:20px; right: 20px; z-index: 3;"
            @click="$emit('exit')" />
          <img class="profileImg"
            v-bind:src="props.data.avatar ? props.data.avatar : loadRandomImage(props.data.userId)"
            @load="$emit('profileLoad')">
          <div class="profileName">
            <div class="username">{{ props.data.username }}</div>
          </div>
        </div>
      </slot>
    </div>
    <div class="back">
      <slot name="back">
        <div class="card">
          <button class="flipButton fade-in" @click="flip">
            <FlipIcon />
          </button>
          <button :disabled="pendingCount" v-if="failedCount" class="openStatsLink" @click="retryReplays"
            style="position: absolute; top:20px; left: 50%; transform: translateX(-50%); z-index: 3">Retry</button>
          <CloseIcon class="icon" style="position: absolute; top:20px; right: 20px; z-index: 3;"
            @click="$emit('exit')" />
          <div class="recordContainer">
            <ul class="recordList">
              <li style="height: 10px;">
              </li>
              <li v-for="rec of renderedReplays" v-bind:key="rec.replayId">
                <div class="link-box">
                  <a v-bind:href="`https://tetr.io/#R:${rec.replayId}`" target="_blank">
                    <ExitIcon class="iconStroke"></ExitIcon>
                  </a>
                </div>
                <div class="check-box">
                  <label v-if="rec.res != 'failed' && rec.res != 'pending'" class="checkContainer">
                    <input @change="$emit('checkedReplays', checkedReplays)" type="checkbox" v-bind:value="rec.replayId"
                      v-model="checkedReplays">
                    <span class="checkmark"></span>
                  </label>
                  <label v-bind:style="{ color: rec.res == 'failed' ? defaultRainbow.red : defaultRainbow.orange }"
                    v-else>{{ rec.res }}</label>
                </div>
                <div class="score-box" v-bind:style="{ color: rec.data!.outcomeColor }" v-text="rec.data!.scoreString">
                </div>
                <a v-bind:href="`https://ch.tetr.io/u/${rec.data!.oppName}`" target="_blank" class="name-box"
                  v-text="rec.data!.oppName"></a>
              </li>
            </ul>
          </div>
        </div>
      </slot>
    </div>
    <div style="display: flex; flex-direction: row;" class="queryStatus">
      <div v-text="`${queryStatus[0]}/${queryStatus[1]} loaded, ${queryStatus[2]} failed`" :class="{
        'status-pending': queryStatus[0] < queryStatus[1] || queryStatus[2] != 0,
        'status-completed': queryStatus[0] == queryStatus[1] && queryStatus[2] == 0,
      }"></div>
      <button @click="emit('reload')" style="margin-left: auto; font-size: inherit;" class="openStatsLink">reload?</button>
    </div>

  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import CloseIcon from "./icons/closeIcon.vue";
import { type RecordEntry } from "@/replay/types/leagueRecord";
import ExitIcon from "./icons/exitIcon.vue";
import { defaultRainbow } from "@/theme/colors";
import Identicon from "identicon.js"
import FlipIcon from "./icons/flipIcon.vue";
import md5 from 'md5'
import { useStatStore, type ReplayStatFetch } from "@/stores/statFetch";
import type { ProfileData } from "@/replay/types/profile";
import { useVisualize } from "@/stores/visualize";
import router from "@/router";
import { calculateCumulativeStats, combineStats, type PlayerCumulativeStats, type PlayerGameStats } from "minomuncher-core";

const emit = defineEmits<{
  (e: 'exit'): void,
  (e: 'reload'): void,
  (e: 'profileLoad'): void,
  (e: 'checkedReplays', value: string[]): void,
}>()
const props = defineProps<{
  data: ProfileData
}>()

const checkedReplays = ref(props.data.checkedReplays)
const statStore = useStatStore()

const renderedReplays = computed(() => {
  const replayIds = props.data.response.data!.entries.map(x => x.replayid)
  const matchingStatuses: ReplayStatFetch[] = statStore.statFetches.filter(x => "replayId" in x && replayIds.includes(x.replayId)).map(x => x as ReplayStatFetch) //todo just use a typeguard omfg
  matchingStatuses.sort((a, b) => replayIds.indexOf(a.replayId) - replayIds.indexOf(b.replayId))
  return matchingStatuses.map(x => {
    const data = getRecordData(props.data.response.data!.entries.find(y => y.replayid == x.replayId)!)
    return { replayId: x.replayId, res: x.res, data }
  })
})


const pendingCount = computed(() => {
  for (const rep of props.data.response.data!.entries) {
    let found = false
    for (const r of props.data.checkedReplays) {
      if (r == rep.replayid) {
        found = true
        break;
      }
    }
    if (!found) {
      continue
    }
    const status = replayStatus(rep.replayid)
    if (status == 'pending') {
      return true
    }
  }
  return false
})

const checkedCount = computed(() => {
  for (const rep of props.data.response.data!.entries) {
    let found = false
    for (const r of props.data.checkedReplays) {
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
      return true
    }
  }
  return false
})

const failedCount = computed(() => {
  for (const rep of props.data.response.data!.entries) {
    let found = false
    for (const r of props.data.checkedReplays) {
      if (r == rep.replayid) {
        found = true
        break;
      }
    }
    if (!found) {
      continue
    }
    const status = replayStatus(rep.replayid)
    if (status == "failed") {
      return true
    }
  }
  return false
})


const { newReplay, replayStatus } = statStore
onMounted(async () => {
  for (const entry of props.data.response.data!.entries) {
    if (entry.stub) continue
    newReplay(props.data.username, entry.replayid)
  }
})

function retryReplays() {
  for (const entry of props.data.response.data!.entries) {
    if (entry.stub) continue
    if (replayStatus(entry.replayid) == "failed") {
      newReplay(props.data.username, entry.replayid, true)
    }
  }
}

function getStatusMessage(t: PlayerGameStats | "pending" | "failed" | 'unloaded') {
  const status = t
  if (status == 'failed' || status == 'pending' || status == 'unloaded') {
    return status
  } else {
    return 'completed'
  }
}
const queryStatus = computed(() => {
  let total = 0
  let okayed = 0
  let failed = 0
  for (const entry of props.data.response.data!.entries.filter(x => !x.stub)) {
    total += 1
    const resp = getStatusMessage(replayStatus(entry.replayid))
    if (resp != 'pending' && resp != 'unloaded') {
      okayed += 1
      if (resp == 'failed') {
        failed += 1
      }
    }
  }
  return [okayed, total, failed]
})


function loadRandomImage(id: string) {
  const identity = new Identicon(md5(id), {
    background: [51, 51, 51, 255],
    margin: 0.15,
    size: 300,
    brightness: 0.48,
    saturation: 0.65,
    format: 'svg'
  }).toString()
  emit('profileLoad')
  return `data:image/svg+xml;base64,${identity}`;
}

function getRecordData(rec: RecordEntry) {
  let homeScore = NaN
  let oppScore = NaN
  let oppName = '?'
  for (const lb of rec.results.leaderboard) {
    if (lb.id == props.data.userId) {
      homeScore = lb.wins
    } else {
      oppName = lb.username
      oppScore = lb.wins
    }
  }
  const scoreString = `${homeScore ?? '?'}-${oppScore ?? '?'}`
  let outcomeColor: string;
  if (Number.isNaN(homeScore) || Number.isNaN(oppScore)) {
    outcomeColor = 'white'
  } else if (homeScore > oppScore) {
    outcomeColor = defaultRainbow.green
  } else {
    outcomeColor = defaultRainbow.red
  }

  return {
    oppName,
    scoreString,
    outcomeColor,
    replayId: rec.replayid
  }

}

const flipped = ref(false);
const flip = () => {
  flipped.value = !flipped.value
};

const { setVisualize } = useVisualize()

function openStats() {
  const newStats: PlayerGameStats = {}
  for (const rep of props.data.response.data!.entries) {
    let found = false
    for (const r of props.data.checkedReplays) {
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
        if (key != props.data.userId) {
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
  const cumulativeStats: PlayerCumulativeStats = {}
  for (const key in newStats) {
    cumulativeStats[key] = { stats: calculateCumulativeStats(newStats[key].stats), username: newStats[key].username }
  }
  setVisualize(cumulativeStats)
  if (Object.keys(cumulativeStats).length == 0) return
  router.push({ path: '/stats' })
}

</script>
<style lang="css" scoped>
@import "@/assets/card.css";

.checkContainer {
  color: var(--f_high);
  display: block;
  position: relative;
  top: -8px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.checkContainer input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 12px;
  width: 12px;
  background: transparent;
  border: 2px dashed var(--f_low);
}

/* On mouse-over, add a grey background color */
.checkContainer:hover input~.checkmark {
  border: 2px dashed var(--f_high);
}

/* When the checkbox is checked, add a blue background */
.checkContainer input:checked~.checkmark {
  border: 2px solid var(--f_high);
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.checkContainer input:checked~.checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.checkContainer .checkmark:after {
  left: 3px;
  top: 0px;
  width: 3px;
  height: 7px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.recordContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  font-size: 12px;
  color: var(--f_high);
}

.recordList {
  padding: 10px;
  margin-top: 50px;
  scrollbar-gutter: stable;
  overflow-y: hidden;
  height: 230px;
  margin-right: auto;
  mask-image: linear-gradient(transparent, #000 10%, #000 90%, transparent);
}

.recordList li a {
  text-decoration: none;
  color: var(--f_low);
}

.recordList li a:hover {
  color: var(--f_high);
}

.recordList li a:active {
  color: var(--f_med);
}

.recordList:hover,
.recordList:active {
  overflow-y: scroll;
}

.recordList li {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.check-box {
  z-index: 5;
  flex: 1;
}

.link-box {
  flex: 1;
  text-align: center;
}

.score-box {
  flex: 1;
  text-align: center;
}

.name-box {
  flex: 5;
  text-align: center;
}

.icon {
  fill: var(--f_low);
  transition: fill 0.2s ease;
}

.icon:hover {
  fill: var(--f_high);
}

.icon:active {
  fill: var(--f_med);
}

.iconStroke {
  stroke: var(--f_low);
  transition: stroke 0.2s ease;
}

.iconStroke:hover {
  stroke: var(--f_high);
}

.iconStroke:active {
  stroke: var(--f_med);
}

.username {
  margin: auto;
  color: var(--f_high);
  font-size: 24px;
  border: none;
  background: transparent;
  max-width: 200px;
  outline: none;
  text-align: center;
  user-select: none;
}
</style>
