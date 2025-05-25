<template>
  <div class="dropZone" :data-active="active" @dragenter.prevent="setActive" @dragover.prevent="setActive"
    @dragleave.prevent="setInactive" @drop.prevent="onDrop" :class="{ 'dropActive': active }">
    drag and drop <br>ttrm files here
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
const emit = defineEmits(['files-dropped'])

const active = ref(false)
let inActiveTimeout: number = -1

function setActive() {
  active.value = true
  clearTimeout(inActiveTimeout)
}
function setInactive() {
  inActiveTimeout = setTimeout(() => {
    active.value = false
  }, 50)
}

function onDrop(e: DragEvent) {
  if (!e.dataTransfer) {
    return
  }
  setInactive()
  emit('files-dropped', [...e.dataTransfer.files])
}

function preventDefaults(e: Event) {
  e.preventDefault()
}

const events = ['dragenter', 'dragover', 'dragleave', 'drop']

onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults)
  })
})

onUnmounted(() => {
  events.forEach((eventName) => {
    document.body.removeEventListener(eventName, preventDefaults)
  })
})
</script>


<style lang="css" scoped>
.dropZone {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: var(--f_low);
  width: 180px;
  height: 100px;
  border: 2px dashed var(--f_low);
  border-radius: 10px;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.dropActive {
  border-color: var(--f_high);
  color: var(--f_high);

}
</style>
