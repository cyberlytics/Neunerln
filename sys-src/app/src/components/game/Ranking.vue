<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { ref } from 'vue'
import axios from 'axios'

const showErrorOrSuccess = ref(true)
const errorState = ref('')

const props = defineProps({
  showModal: Boolean
})
let users: any

onMounted(() => {
  //move to open modal
  retrieveRankings()
  console.log(users)
})

watch(
  () => props.showModal,
  () => console.log('test')
  // (newValue) => {
  //   console.log('rankings sind da')
  //   if (newValue) {
  //     users = retrieveRankings()
  //   }
  // }
)

async function retrieveRankings() {
  try {
    const res = await axios.get('http://localhost:3000/api/rankings')
    // console.log(res.data)
    showErrorOrSuccess.value = true
    users = res.data
    console.log(users)
  } catch (err: any) {
    //TODO: Fehler dem User anzeigen
    if (err.response.status === 500)
      errorState.value = 'Verbindung zum Server fehlgeschlagen. Bitte erneut versuchen.'
    console.log(err)
    return
  }
  errorState.value = 'Einloggen erfolgreich'
  //TODO: Weiterleitung
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
