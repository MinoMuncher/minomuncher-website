<template>
  <div ref="outerBody" id="outerBody"></div>
</template>
<script setup lang="ts">
import { createGraphs } from '@/graphs/generateGraphs';
import { demoStats } from '@/replay/demo';
import { onMounted, ref } from 'vue';

const outerBody = ref<HTMLElement | undefined>()

onMounted(() => {
  if (outerBody.value === undefined) throw Error()
  createGraphs(outerBody.value, demoStats)
})

//import type { CumulativeStats } from '@/replay/types/stats';
//const props = defineProps<{ stats: CumulativeStats }>()

</script>
<style lang="css" scoped>
@import url('https://fonts.googleapis.com/css2?family=Martel:wght@200;300;400;600;700;800;900&display=swap');

#outerBody {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 3 columns */
  gap: 0px;
  /* space between boxes */
  width: 100%;
  height: 100%;
  /* fixed width container */
  margin: 20px auto;

  font-family: "Martel", serif;
  font-weight: 700;
  font-style: normal;
  font-size: 10px;
}

#outerBody svg {
  height: 100px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
}
</style>
