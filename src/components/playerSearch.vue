<template>
  <div style="display: flex; flex-direction: row; align-items: center; margin-left: 10px;">
    <input type="text" v-on:blur="onUsernameExit" v-on:keyup.enter="onUsernameSubmit" v-model="usernameInput"
      v-bind:class="{ loading: submittingUsername.length > 0 }" v-bind:disabled="submittingUsername.length > 0"
      v-bind:placeholder="usernamePlaceholder" />
  </div>
</template>
<script lang="ts" setup>
import type { LeagueResponse } from '@/replay/types/leagueRecord';
import type { ProfileData } from '@/replay/types/profile';
import type { ReplayDropData } from '@/replay/types/replayDrop';
import { ref, type Ref } from 'vue';

const props = defineProps<{
  cards: Ref<(ProfileData | ReplayDropData)[]>
}>()

const emit = defineEmits<{
  (e: 'response', value: ProfileData): void
}>()
const usernameInput = ref("")
const usernamePlaceholder = ref("add league name...")
const submittingUsername = ref("")
function onUsernameExit() {
  usernameInput.value = submittingUsername.value
}
async function onUsernameSubmit() {
  if (props.cards.value.some(x => 'username' in x && x.username === usernameInput.value)) {
    usernamePlaceholder.value = 'duplicate username';
    usernameInput.value = ''
    submittingUsername.value = '';
  }

  submittingUsername.value = usernameInput.value
  if (submittingUsername.value == "") return

  let userId: string | undefined

  try {
    const resp = await fetch(`/api/user/${submittingUsername.value.toLowerCase()}`)
    const txt = await resp.text()
    const js = JSON.parse(txt)
    const id = js["data"]["_id"]
    const avatarRev: number | undefined = js["data"]['avatar_revision']

    //avatar_revision? (int) — This user's avatar ID. Get their avatar at https://tetr.io/user-content/avatars/{ USERID }.jpg?rv={ AVATAR_REVISION }
    if (typeof id === "string") {
      if (id.length > 0) {
        userId = id
      }
    }
    if (userId == undefined) {
      throw Error("no user id found")
    }
    try {
      const response = await fetch(`/api/league/${userId}`);
      const json: LeagueResponse = await response.json();

      if (json.error !== undefined) {
        usernamePlaceholder.value = String(json.error);
      } else if (!json.success) {
        usernamePlaceholder.value = 'Query Unsuccessful';
      } else {
        usernamePlaceholder.value = 'add league name...';
        emit('response', { response: json, userId, username: submittingUsername.value, avatar: avatarRev ? `https://tetr.io/user-content/avatars/${userId}.jpg?rv=${avatarRev}` : undefined, avatarLoaded: false });
      }
    } catch (error) {
      usernamePlaceholder.value = 'Network or server error';
      console.error(error);
    }
  } catch (error) {
    usernamePlaceholder.value = 'Error fetching userID';
    console.error(error);
  }

  usernameInput.value = ''
  submittingUsername.value = '';
}

</script>
<style lang="css" scoped>
input {
  display: block;
  background: transparent;
  color: var(--f_high);
  font-size: 24px;
  border: none;
  max-width: 300px;
  outline: none;
  border-bottom: 2px solid var(--f_low);
  border-radius: 5px;
}

.loading {
  color: var(--f_low);
}
</style>
