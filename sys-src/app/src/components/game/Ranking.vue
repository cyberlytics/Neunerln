<script setup lang="ts">
import { watch } from 'vue'
import { ref } from 'vue'
import axios from 'axios'

const showErrorOrSuccess = ref(true)
const errorState = ref('')

const props = defineProps({
  showModal: Boolean,
  userName: String
})

let users: any = ref(null)

watch(
  () => props.showModal,
  async (newValue) => {
    if (newValue) {
      users.value = await retrieveRankings()
    }
  }
)

async function retrieveRankings() {
  try {
    const res = await axios.get('https://35.158.148.247:3000/api/rankings')
    showErrorOrSuccess.value = true
    errorState.value = 'Rankings erfolgreich erhalten'
    return res.data.ranking
  } catch (err: any) {
    //TODO: Fehler dem User anzeigen
    if (err.response.status === 500)
      errorState.value = 'Verbindung zum Server fehlgeschlagen. Bitte erneut versuchen.'
    console.log(err)
    return
  }
}

const emit = defineEmits(['closeModal'])
</script>

<template>
  <!-- <Transition name="ranking"> -->
  <!-- <dialog class="ranking-container"> -->
  <div class="ranking-wrapper">
    <div class="ranking-header">
      <slot name="header">Ranking</slot>
    </div>

    <div class="ranking-body">
      <slot name="body">
        <div class="ranking-entry">
          <div>Rank</div>
          <div>Username</div>
          <div>Wins</div>
          <div>Games</div>
          <div>Winrate</div>
        </div>

        <div v-for="user in users">
          <div
            v-if="userName == user.username"
            style="background-color: rgb(84, 141, 84); color: #ffffff"
            class="ranking-entry"
          >
            <div>{{ user.rank }}</div>
            <div>{{ user.username }}</div>
            <div>{{ user.wins }}</div>
            <div>{{ user.played }}</div>
            <div>{{ Math.round(user.winrate) }}%</div>
          </div>
          <div v-else class="ranking-entry">
            <div>{{ user.rank }}</div>
            <div>{{ user.username }}</div>
            <div>{{ user.wins }}</div>
            <div>{{ user.played }}</div>
            <div>{{ Math.round(user.winrate) }}%</div>
          </div>
        </div>
      </slot>
    </div>

    <div class="ranking-footer">
      <slot name="footer">
        <button class="ranking-default-button" @click="emit('closeModal')">Close</button>
      </slot>
    </div>
  </div>
  <!-- </dialog> -->
  <!-- </Transition> -->
</template>

<style>
.ranking-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ranking-header {
  margin-top: 3vh;
  margin-bottom: 3vh;
}
.ranking-footer {
  margin-top: 3vh;
  margin-bottom: 1vh;
}
.ranking-body {
  width: 100%;
}
.ranking-entry {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  justify-items: center;
  margin-bottom: 1vh;
}
</style>
