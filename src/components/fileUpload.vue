<template>
  <div>
    <p style="position: relative; height: 0px; margin: 0px; left: 12px; top:12px; color: var(--rainbow_red)"
      v-text="errorMessage">
    </p>
    <div class="dropZone" :data-active="active" @dragenter.prevent="setActive" @dragover.prevent="setActive"
      @dragleave.prevent="setInactive" @drop.prevent="onDrop" :class="{ 'dropActive': active }">
      <p>drag or </p>
      <label for="files"><strong>select</strong></label>
      <input @change="fileInputChange()" id="files" type="file" ref="fileInput" name="files" multiple>
      <p> ttrm</p>
    </div>
  </div>

</template>

<script setup lang="ts">
import type { User } from '@/replay/types/leagueRecord';
import type { ProfileData } from '@/replay/types/profile';
import type { ReplayDropData } from '@/replay/types/replayDrop';
import md5 from 'md5';
import { onMounted, onUnmounted, ref } from 'vue'

const errorMessage = ref("")

const props = defineProps<{
  cards: (ProfileData | ReplayDropData)[]
}>()


const emit = defineEmits<{
  (e: 'fileUpload', value: ReplayDropData[]): void
}>()

async function handleFiles(files: FileList) {
  const okayFiles: ReplayDropData[] = []
  for (const file of files) {
    try {
      const rawText = await file.text()
      const rawData = JSON.parse(rawText)
      const dataHash = md5(rawText)

      if (props.cards.some(x => 'dataHash' in x && x.dataHash === dataHash)) {
        errorMessage.value = "duplicate"
        setTimeout(() => errorMessage.value = '', 2000)
        continue
      }
      if ('users' in rawData && Array.isArray(rawData['users'])) {
        const checked = rawData['users'].map(x => (x as User).username)
        if (checked.length == 0) {
          errorMessage.value = "no users"
          setTimeout(() => errorMessage.value = '', 2000)
          continue
        }
        okayFiles.push({
          fileName: file.name,
          users: rawData['users'],
          checkedUsers: checked,
          data: rawText,
          dataHash,
        })
      }
    } catch (e) {
      errorMessage.value = "invalid"
      setTimeout(() => errorMessage.value = '', 2000)

      console.error(e)
    }

  }
  if (okayFiles.length > 0) {
    emit('fileUpload', okayFiles)
  }
}


const fileInput = ref<HTMLInputElement | undefined>()
function fileInputChange() {
  if (!fileInput.value) throw Error()
  if (fileInput.value.files) {
    handleFiles(fileInput.value.files).finally(() => {
      fileInput.value!.value = ''
    })
  }
}

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
  handleFiles(e.dataTransfer.files)
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
input[type=file] {
  display: none;
}

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
