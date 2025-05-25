<template>
  <div @mouseenter.prevent="flip" @mouseleave.prevent="unflip" :class="['card-container', flipped ? 'flipped' : '']"
    :style="{ width: `${300}px`, height: `${300}px` }">
    <div class="front">
      <slot name="front">
        <div class="card">
          <img class="profileImg" src="https://tetr.io/res/avatar.png">
          <div class="userData">
            <div class="username">freyhoe</div>
          </div>
        </div>
      </slot>
    </div>
    <div class="back">
      <slot name="back">
        <div class="card backCard" style="color:wheat">
          <CloseIcon class="editIcon" style="position: absolute; top:20px; right: 20px" @click="$emit('deleteCard')" />
          <div class="croppedImgContainer">
            <div style="position: absolute; mix-blend-mode: difference; z-index: 3; color: white; font-size: x-large;">
              View Graphs</div>
            <GraphIcon style="transform: scale(2);" />
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import GraphIcon from "./graphIcon.vue";
import CloseIcon from "./closeIcon.vue";
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

.username {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;
  color: var(--f_high);
  font-size: 24px;
  border: none;
  background: transparent;
  max-width: 200px;
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
