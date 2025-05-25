<template>
  <div @mouseenter.prevent="flip" @mouseleave.prevent="unflip" :class="['card-container', flipped ? 'flipped' : '']"
    :style="{ width: `${300}px`, height: `${300}px` }">
    <div class="front">
      <slot name="front">
        <div class="card">
          <div class="userData">
            <div class="fileName">replay.ttrm</div>
            <div class="fileUsers" v-bind:style="{ color: `${defaultRainbow.teal}`, textAlign: 'center' }">
              <div v-for="(name, index) in props.usernames" :key="index">
                <strong v-bind:style="{ color: defaultRainbow.green }" v-if="checkedNames.includes(name)">{{ name
                }}</strong>
                <span v-else> {{ name }}</span>
                <span class="punct" v-if="index < props.usernames.length - 2">,</span>
                <span class="punct" v-else-if="index === props.usernames.length - 2">, and</span>
              </div>
            </div>
          </div>
        </div>
      </slot>
    </div>
    <div class="back">
      <slot name="back">
        <div class="card backCard">
          <div class="openStatsLink" style="position: absolute; top:20px; left: 20px; z-index: 3">Open Stats</div>
          <CloseIcon class="editIcon" style="position: absolute; top:20px; right: 20px" @click="$emit('exit')" />
          <div class="userList">
            <label v-for="name of props.usernames" v-bind:key="name" class="checkContainer">{{ name }}
              <input type="checkbox" v-bind:value="name" v-model="checkedNames">
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import CloseIcon from "./closeIcon.vue";
import { defaultRainbow } from "@/theme/colors";
const props = defineProps({
  replayName: { type: String, required: true },
  error: { type: String },
  usernames: { type: Array<string>, required: true }
})

defineEmits<{
  (e: 'exit'): void
}>()
const checkedNames = ref<string[]>([])
const inActiveTimeout = ref(-1)

const flipped = ref(false);
const flip = () => {
  flipped.value = true
  clearTimeout(inActiveTimeout.value)
};
const unflip = () => {
  inActiveTimeout.value = setTimeout(() => {
    flipped.value = false
  }, 100)
};
</script>
<style lang="css" scoped>
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


.fileUsers {
  display: flex;
  flex-direction: row;
  width: 80%;
  justify-content: center;
}

.fileUsers div .punct {
  margin-right: 1ch;
}


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


.card-container {
  margin: 0;
  padding: 0;
  position: relative;
  box-sizing: border-box;

  .front,
  .back {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    display: block;
    position: absolute;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    transition: -webkit-transform ease 500ms;
    transition: transform ease 500ms;
  }

  .front {
    z-index: 2;
    transform: rotateY(0deg);
    /* front tile styles go here! */
  }

  .back {
    transform: rotateY(-180deg);
    font-size: 20px;
    /* back tile styles go here! */
  }

  &.flipped {
    .front {
      transform: rotateY(180deg);
    }

    .back {
      transform: rotateY(0deg);
    }
  }
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

.profileImg {
  width: 200px;
  height: 200px;
  border-radius: 20px;
  border: 1px solid var(--b_high);
  margin: 20px;
  margin-top: 40px;
}

.croppedImgContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 20px;
  border: 1px solid var(--b_high);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  transition: transform 0.2s ease
}

.croppedImgContainer:hover {
  transform: translate(-50%, -50%) scale(0.9);
}

.userData {
  color: var(--f_high);
  width: 100%;
  height: 100%;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

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
