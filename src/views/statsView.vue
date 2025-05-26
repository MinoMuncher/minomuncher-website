<template>
  <div id="scene">
    <div id="left-zone">
      <ul class="list">
        <li v-for="key in OrderedGraphTypes" v-bind:key="key" class="item">
          <button v-bind:class="{ selected: selectedGraph === key || altSelectedGraph === key }"
            @click="newGraph(key)">{{
              key }}</button>
        </li>
        <li class="item">
          <button @click="router.back()" :style="{ color: defaultRainbow.red }">
            back</button>
        </li>
      </ul>
    </div>
    <div id="right-zone">
      <TransitionGroup name="list">
        <GraphWrapper class="graphWrapper" :data="demoStats" v-if="selectedGraph != undefined"
          v-bind:type="selectedGraph"></GraphWrapper>
        <GraphWrapper class="graphWrapper" :data="demoStats" v-else-if="altSelectedGraph != undefined"
          v-bind:type="altSelectedGraph">
        </GraphWrapper>
      </TransitionGroup>
    </div>
  </div>
</template>
<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';
import { OrderedGraphTypes, type GraphType } from '@/graphs/types';

import { demoStats } from '@/replay/demo';
import GraphWrapper from '@/components/graphWrapper.vue';
import { defaultRainbow } from '@/theme/colors';

const selectedGraph = ref<GraphType | undefined>("clear types")
const altSelectedGraph = ref<GraphType | undefined>(undefined)


function newGraph(t: GraphType) {
  if (altSelectedGraph.value == undefined) {
    altSelectedGraph.value = t
    selectedGraph.value = undefined
  } else {
    altSelectedGraph.value = undefined
    selectedGraph.value = t
  }
}
</script>
<style lang="css" scoped>
@import url('https://fonts.googleapis.com/css2?family=Martel:wght@200;300;400;600;700;800;900&display=swap');

.graphWrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}

.selected {
  color: var(--f_high);
  background-color: var(--b_med);
}


.list {
  display: flex;
  flex-direction: column;
  width: 200px;
  padding-top: 50px;
  padding-bottom: 50px;

}

li {
  display: flex;
  justify-content: center;
}

button {
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
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

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

#left-zone {
  border-right: 3px solid var(--f_low);
}

#right-zone {
  width: 700px;
  position: relative;
}


#scene {
  display: flex;
  flex-direction: row;
}
</style>
