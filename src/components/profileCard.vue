<template>
  <div @mouseenter.prevent="flip" @mouseleave.prevent="unflip" :class="['card-container', flipped ? 'flipped' : '']"
    :style="{ width: `${300}px`, height: `${300}px` }">
    <div class="front">
      <slot name="front">
        <div class="card">
          <img class="profileImg" src="https://tetr.io/res/avatar.png">
          <div class="userData">
            <div class="username">{{ props.username }}</div>
          </div>
        </div>
      </slot>
    </div>
    <div class="back">
      <slot name="back">
        <div class="card backCard">
          <div class="openStatsLink" style="position: absolute; top:20px; left: 20px">Open Stats</div>
          <CloseIcon class="icon" style="position: absolute; top:20px; right: 20px" @click="$emit('deleteCard')" />
          <div class="recordContainer">
            <div v-for="rec of records" v-bind:key="rec._id">
              <div class="link-box">
                <ExitIcon class="iconStroke"></ExitIcon>
              </div>
              <div class="score-box">Score: 85</div>
              <div class="name-box">Full Name Here</div>
            </div>
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
const props = defineProps<{
  username: string,
  error?: string,
  records: RecordEntry[]
}>()

let inActiveTimeout = -1

const flipped = ref(false);
const flip = () => {
  flipped.value = true
  clearTimeout(inActiveTimeout)
};
const unflip = () => {
  inActiveTimeout = setTimeout(() => {
    flipped.value = false
  }, 100)
};
</script>
<style lang="css" scoped>
.recordContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
}

.recordContainer div {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.link-box {
  flex: 1;
  background-color: #e0f7fa;
  text-align: center;
}

.score-box {
  flex: 2;
  background-color: #ffe0b2;
  text-align: center;
}

.name-box {
  flex: 3;
  background-color: #c8e6c9;
  text-align: center;
}

.card-container {
  margin: 0;
  padding: 0;
  position: relative;
  box-sizing: border-box;
}

.card-container .front,
.card-container .back {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: block;
  position: absolute;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  transition: transform ease 500ms;
}

.card-container .front {
  z-index: 2;
  transform: rotateY(0deg);
}

.card-container .back {
  transform: rotateY(-180deg);
  font-size: 20px;
}

.card-container.flipped .front {
  transform: rotateY(180deg);
}

.card-container.flipped .back {
  transform: rotateY(0deg);
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

.openStatsLink {
  user-select: none;
  color: var(--f_low);
  transition: color 0.2s ease;
}

.openStatsLink:hover {
  color: var(--f_high);
}

.openStatsLink:active {
  color: var(--f_med);
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

.profileImg {
  width: 200px;
  height: 200px;
  border-radius: 20px;
  border: 1px solid var(--b_high);
  margin: 20px;
  margin-top: 40px;
}

.userData {
  color: var(--f_high);
  background-color: var(--b_high);
  width: 100%;
  height: 100%;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  display: flex;
  flex-direction: column;
}

.card {
  width: 300px;
  height: 300px;
  border: 4px solid var(--b_med);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.backCard {
  position: absolute;
}
</style>
