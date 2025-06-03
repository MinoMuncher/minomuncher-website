<template>
  <div id="scene">
    <div id="left-zone">
      <ul class="list">
        <li v-for="key in OrderedGraphTypes" v-bind:key="key" class="item">
          <button v-bind:class="{ selected: selectedGraph === key }" @click="newGraph(key)">{{
            key }}</button>
        </li>
        <li class="item">
          <button @click="router.push({ path: '/home' })" :style="{ color: defaultRainbow.red }">
            back</button>
        </li>
      </ul>
    </div>
    <div id="right-zone">
      <Transition name="list">
        <GraphWrapper class="graphWrapper" :data="data" :type="selectedGraph"></GraphWrapper>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';
import { OrderedGraphTypes, type GraphType } from '@/graphs/types';
import GraphWrapper from '@/components/graphWrapper.vue';
import { defaultRainbow } from '@/theme/colors';
import { useVisualize } from '@/stores/visualize';
import { demoStats } from '@/replay/demo';

const cachedData = useVisualize().visualize
const data = Object.keys(cachedData).length > 0 ? cachedData : demoStats

const selectedGraph = ref<GraphType>("clear types")


function newGraph(t: GraphType) {
  console.log(t)
  selectedGraph.value = t

}
</script>
<style lang="css" scoped>
@import url('https://fonts.googleapis.com/css2?family=Martel:wght@200;300;400;600;700;800;900&display=swap');


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
  padding-top: 50px;
  padding-bottom: 50px;
  font-size: 2.2vh;
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
  width: 30%;
}

#right-zone {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}


#scene {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
}
</style>
