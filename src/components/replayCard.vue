<template>
  <div :class="['card-container', flipped ? 'flipped' : '']" :style="{ width: `${300}px`, height: `${300}px` }">
    <div class="front">
      <slot name="front">
        <div class="card">
          <button class="flipButton fade-in" @click="flip">
            <FlipIcon />
          </button>
          <CloseIcon class="editIcon" style="position: absolute; top:20px; right: 20px; z-index: 3;"
            @click="$emit('exit')" />
          <button v-if="queryStatus == 'completed'" class="openStatsLink" @click="calculateVisualize()"
            style="position: absolute; bottom:20px; left: 50%; transform: translateX(-50%); z-index: 3">Open
            Stats</button>
          <div class="userData">
            <div class="fileName">replay.ttrm</div>
            <div class="fileUsers" v-bind:style="{ color: `${defaultRainbow.teal}`, textAlign: 'center' }">
              <div v-for="(user, index) in props.data.users" :key="index">
                <strong v-bind:style="{ color: defaultRainbow.green, whiteSpace: 'nowrap' }"
                  v-if="checkedUsers.some(x => x == user.id)">{{
                    user.username
                  }}</strong>
                <span v-else> {{ user.username }}</span>
                <span class="punct" v-if="index < props.data.users.length - 2">,</span>
                <span style="white-space: nowrap; margin-left: 1ch;" class="punct"
                  v-else-if="index === props.data.users.length - 2 && props.data.users.length === 2">and</span>
                <span style="white-space: nowrap;" class="punct" v-else-if="index === props.data.users.length - 2">,
                  and</span>
              </div>
            </div>
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
          <CloseIcon class="editIcon" style="position: absolute; top:20px; right: 20px; z-index: 3;"
            @click="$emit('exit')" />
          <template v-if="queryStatus == 'completed'">
            <button class="openStatsLink" @click="calculateVisualize()"
              style="position: absolute; bottom:20px; left: 50%; transform: translateX(-50%); z-index: 3">Open
              Stats</button>
            <div class="userList">
              <label v-for="user of props.data.users" v-bind:key="user.id" class="checkContainer">{{ user.username }}
                <input type="checkbox" @change="$emit('checkedUsers', checkedUsers)" v-bind:value="user.id"
                  v-model="checkedUsers">
                <span class="checkmark"></span>
              </label>
            </div>
          </template>
          <template v-else>
            <div v-if="queryStatus == 'pending'" class="fileName"> Retrying...</div>
            <div v-else class="fileName" :style="{ color: defaultRainbow.red }"
              v-text="retries == 0 ? 'Replay Failed' : `Failed ${retries + 1}x`"></div>
            <button v-text="retries < 2 ? 'Retry' : 'Report This!'" :disabled="queryStatus == 'pending' || retries >= 2"
              class="openStatsLink"
              @click="() => { retries += 1; newFile(props.data.dataHash, props.data.data, true) }"></button>
          </template>
        </div>
      </slot>
    </div>
    <div class="queryStatus" v-text="queryStatus" :class="{
      'status-pending': queryStatus == 'pending',
      'status-failed': queryStatus == 'failed' || queryStatus == 'unloaded',
      'status-completed': queryStatus == 'completed',
    }"></div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import CloseIcon from "./icons/closeIcon.vue";
import { defaultRainbow } from "@/theme/colors";
import FlipIcon from "./icons/flipIcon.vue";
import { useStatStore } from "@/stores/statFetch";
import type { ReplayDropData } from "@/replay/types/replayDrop";
import { useVisualize } from "@/stores/visualize";
import router from "@/router";
import { calculateCumulativeStats, combineStats, type PlayerCumulativeStats, type PlayerGameStats } from "minomuncher-core";
const retries = ref(0)

const props = defineProps<{
  data: ReplayDropData,
}>()

const statStore = useStatStore()
const { newFile, fileStatus } = statStore
onMounted(() => {
  newFile(props.data.dataHash, props.data.data)
})

function getStatusMessage(t: PlayerGameStats | "pending" | "failed" | 'unloaded') {
  const status = t
  if (status == 'failed' || status == 'pending' || status == 'unloaded') {
    return status
  } else {
    return 'completed'
  }
}
const queryStatus = computed(() => {
  return getStatusMessage(fileStatus(props.data.dataHash))
})

defineEmits<{
  (e: 'exit'): void,
  (e: 'checkedUsers', value: string[]): void
}>()
const flipped = ref(false);
const flip = () => {
  flipped.value = !flipped.value
};
const checkedUsers = ref(props.data.checkedUsers)

const { setVisualize } = useVisualize()

function calculateVisualize() {
  const newStats: PlayerGameStats = {}
  const status = fileStatus(props.data.dataHash)
  if (typeof status == "object") {
    for (const key in status) {
      let found = false
      for (const r of props.data.checkedUsers) {
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
    const cumulativeStats: PlayerCumulativeStats = {}
    for (const key in newStats) {
      cumulativeStats[key] = { stats: calculateCumulativeStats(newStats[key].stats), username: newStats[key].username }
    }
    setVisualize(cumulativeStats)
    if (Object.keys(cumulativeStats).length == 0) return
    router.push({ path: '/stats' })
  }
}

</script>
<style lang="css" scoped>
@import "@/assets/card.css";

.checkContainer {
  color: var(--f_high);
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
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
  height: 25px;
  width: 25px;
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
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.userData {
  align-items: center;
  justify-content: center;

}

.fileUsers {
  display: flex;
  flex-direction: row;
  width: 80%;
  justify-content: center;
}

.fileUsers div .punct {
  margin-right: 1ch;
}

.userList {
  display: flex;
  flex-direction: column;
}

.graphImg {
  transition: transform 0.2s ease;
}

.graphImg:hover {
  transform: scale(1.1);
}

.userFetchStatus {
  min-height: 10px;
}

.usernameInput {
  background-color: var(--background);
  color: var(--f_high);
  font-size: 24px;
  border: none;
  background: transparent;
  max-width: 200px;
  outline: none;
}

.profileActionContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px;
}

.profileActionContainer button {
  background: transparent;
  color: var(--f_low);
  border: 2px solid var(--f_low);
  padding: 10px;
  border-radius: 5px;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.profileActionContainer button:hover {
  border-color: var(--f_med);
  color: var(--f_med);
}

.exitIcon:hover {
  stroke: var(--f_med);
}

.exitIcon {
  stroke: var(--f_high);
}

.editIcon {
  fill: var(--f_low);
  transition: fill 0.2s ease;
}

.editIcon:hover {
  fill: var(--f_high);
}

.lastUpdated {
  margin-left: 20px;
  font-size: small;
  color: var(--f_high);
}

.lastUpdated span {
  margin-left: 5px;
  color: var(--f_med);
}

.fileName {
  color: var(--f_high);
  font-size: 24px;
  border: none;
  background: transparent;
  max-width: 200px;
  max-height: 40px;
  outline: none;
  text-align: center;
}
</style>
