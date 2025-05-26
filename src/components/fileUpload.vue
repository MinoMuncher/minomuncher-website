<template>
  <div class="dropZone" :data-active="active" @dragenter.prevent="setActive" @dragover.prevent="setActive"
    @dragleave.prevent="setInactive" @drop.prevent="onDrop" :class="{ 'dropActive': active }" v-text="dropText">
  </div>
</template>

<script setup lang="ts">
import type { ReplayDropData } from '@/replay/types/replayDrop';
import md5 from 'md5';
import { onMounted, onUnmounted, ref } from 'vue'
const emit = defineEmits<{
  (e: 'fileUpload', value: ReplayDropData[]): void
}>()

const dropText = ref("drag and drop\nttrm files here")

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

async function onDrop(e: DragEvent) {
  if (!e.dataTransfer) {
    return
  }
  setInactive()
  const okayFiles: ReplayDropData[] = []
  for (const file of e.dataTransfer.files) {
    try {
      const rawText = await file.text()
      const rawData = JSON.parse(rawText)
      if ('users' in rawData && Array.isArray(rawData['users'])) {
        okayFiles.push({
          fileName: file.name,
          users: rawData['users'],
          data: rawText,
          dataHash: md5(rawText)
        })
      fetch("/api/replay", {
        method: "POST",
        body: rawText,
      }).then(x=>x.text()).then(console.log)

      }
    } catch (e) {
      console.error(e)
    }

  }
  if (okayFiles.length > 0) {
    emit('fileUpload', okayFiles)
  } else if (e.dataTransfer.files.length > 0) {
    dropText.value = "invalid replay!"
    setTimeout(() => {
      dropText.value = "drag and drop\nttrm files here"
    }, 1000)
  }
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
  white-space: pre;
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
