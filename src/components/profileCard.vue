<template>
  <div :class="['card-container', flipped ? 'flipped' : '']" :style="{ width: `${300}px`, height: `${300}px` }">
    <button class="flipButton fade-in" @click="flip" v-if="!flipping">
      <FlipIcon />
    </button>
    <div class="front">
      <slot name="front">
        <div class="card">
          <img class="profileImg" v-bind:src="avatar ? avatar : loadRandomImage(props.id)" @load="$emit('profileLoad')">
          <div class="userData">
            <div class="username">{{ props.username }}</div>
          </div>
        </div>
      </slot>
    </div>
    <div class="back">
      <slot name="back">
        <div class="card backCard">
          <button class="openStatsLink"
            style="position: absolute; top:20px; left: 50%; transform: translateX(-50%); z-index: 3">Open Stats</button>
          <CloseIcon class="icon" style="position: absolute; top:20px; right: 20px; z-index: 3;"
            @click="$emit('exit')" />
          <div class="recordContainer">
            <ul class="recordList">
              <li style="height: 10px;">

              </li>
              <li v-for="rec of records.filter(x => !x.stub).map(getRecordData)" v-bind:key="rec.replayId">
                <div class="link-box">
                  <a v-bind:href="`https://tetr.io/#R:${rec.replayId}`" target="_blank">
                    <ExitIcon class="iconStroke"></ExitIcon>
                  </a>
                </div>
                <div class="check-box">
                  <label class="checkContainer">
                    <input type="checkbox" v-bind:value="rec.replayId" v-model="checkedReplays">
                    <span class="checkmark"></span>
                  </label>
                </div>
                <div class="score-box" v-bind:style="{ color: rec.outcomeColor }" v-text="rec.scoreString"></div>
                <a v-bind:href="`https://ch.tetr.io/u/${rec.oppName}`" target="_blank" class="name-box"
                  v-text="rec.oppName"></a>
              </li>
            </ul>

          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import CloseIcon from "./closeIcon.vue";
import { type RecordEntry } from "@/replay/types/leagueRecord";
import ExitIcon from "./exitIcon.vue";
import { defaultRainbow } from "@/theme/colors";
import Identicon from "identicon.js"
import FlipIcon from "./flipIcon.vue";
import md5 from 'md5'

const emit = defineEmits<{
  (e: 'exit'): void,
  (e: 'profileLoad'): void
}>()
const props = defineProps<{
  username: string,
  avatar?: string,
  id: string,
  error?: string,
  records: RecordEntry[]
}>()

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
    if (lb.id == props.id) {
      homeScore = lb.wins
    } else {
      oppName = lb.username
      oppScore = lb.wins
    }
  }
  const scoreString = `${homeScore || '?'}-${oppScore || '?'}`
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

const checkedReplays = ref<string[]>(props.records.map(x => x.replayid))

const inActiveTimeout = ref(-1)

const flipping = ref(false)
const flipped = ref(false);
const flip = () => {
  flipped.value = !flipped.value
  flipping.value = true
  setTimeout(() => flipping.value = false, 200)
  clearTimeout(inActiveTimeout.value)
};
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
