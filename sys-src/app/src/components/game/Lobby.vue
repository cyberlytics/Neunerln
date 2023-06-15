<template>
  <div>
    <h3>{{ userName }}</h3>
    <hr />
    <br />

    <button id="showRankings" @click="showModal = true">Rankings</button>

    <Teleport to="body">
      <modal :show="showModal" @Close="showModal = false"
        ><template #body>
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
                <div class="ranking-entry">
                  <div>{{ user.rank }}</div>
                  <div>{{ user.username }}</div>
                  <div>{{ user.played }}</div>
                  <div>{{ user.wins }}</div>
                  <div>{{ user.winrate }}</div>
                </div>
              </div>
            </slot>
          </div>
        </template></modal
      >
    </Teleport>

    <h2>Create</h2>

    <div>special cards: {{ specialCards }}</div>
    <div class="specCards">
      <div class="specCard">
        <CardFront
          value="7"
          descrip="Der nächste Spieler muss zwei Karten vom Ziehstapel ziehen. Er kann allerdings selbst eine 7 auf die zuvor Gespielte legen."
        />
        <input type="checkbox" id="seven" value="seven" v-model="specialCards" />
      </div>
      <div class="specCard">
        <CardFront
          value="8"
          descrip="Der nächste Spieler muss aussetzen und der darauffolgende Spieler kommt an die Reihe."
        />
        <input type="checkbox" id="eight" value="eight" v-model="specialCards" />
      </div>
      <div class="specCard">
        <CardFront
          value="9"
          descrip="Diese Karte darf auf jede Karte gelegt werden, unabhängig von Farbe oder Zahl. Der Spieler darf sich eine Farbe wünschen."
        />
        <input type="checkbox" id="nine" value="nine" v-model="specialCards" />
      </div>
      <div class="specCard">
        <CardFront
          value="10"
          descrip="Der Spieler darf eine Karte verdeckt an einen Mitspieler weitergeben, der diese aufnehmen muss."
        />
        <input type="checkbox" id="ten" value="ten" v-model="specialCards" />
      </div>
      <div class="specCard">
        <CardFront value="A" descrip="Der Spieler ist direkt noch einmal an der Reihe." />
        <input type="checkbox" id="ace" value="ace" v-model="specialCards" />
      </div>
    </div>
    <!-- <input type="checkbox" id="seven" value="seven" v-model="specialCards" />
    <label for="seven">7</label>
    <input type="checkbox" id="eight" value="eight" v-model="specialCards" />
    <label for="eight">8</label>
    <input type="checkbox" id="nine" value="nine" v-model="specialCards" />
    <label for="nine">9</label>
    <input type="checkbox" id="ten" value="ten" v-model="specialCards" />
    <label for="ten">10</label>
    <input type="checkbox" id="ace" value="ace" v-model="specialCards" />
    <label for="ace">ace</label> -->
    <!-- <br><br> -->

    <div>players: {{ maxPlayers }}</div>
    <input type="radio" id="two" value="2" v-model="maxPlayers" />
    <label for="two">2</label>
    <input type="radio" id="three" value="3" v-model="maxPlayers" />
    <label for="three">3</label>
    <input type="radio" id="four" value="4" v-model="maxPlayers" />
    <label for="four">4</label>

    <br />
    <button @click="createRoom()">Create room</button>

    <br /><br />
    <!-- <hr> -->
    <br />

    <h2>Open Rooms</h2>
    <ul>
      <li v-for="room in props.rooms" :key="room.id">
        <div>Name: {{ room.name }}</div>
        <div>Special Cards: {{ room.specialCards }}</div>
        <div>Players: {{ room.currentPlayers }}/{{ room.maxPlayers }}</div>
        <button @click="joinRoom(room.id)">Join</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
//#region imports
import type { PublicRoomData } from '@/types/publicRoomData'
import CardFront from '../game/CardFront.vue'
import Modal from '../game/Ranking.vue'
import { ref } from 'vue'
import axios from 'axios'
//#endregion imports

const specialCards = ref(['seven', 'eight', 'nine', 'ten', 'ace'])
const maxPlayers = ref(2)
const showErrorOrSuccess = ref(true)
const errorState = ref('')
const showModal = ref(false)
let users = retrieveRankings()

const props = defineProps({
  rooms: Array<PublicRoomData>,
  userName: String
})
const emit = defineEmits(['createRoom', 'joinRoom'])

function createRoom() {
  emit('createRoom', specialCards.value, maxPlayers.value)
}

function joinRoom(roomId: string) {
  emit('joinRoom', roomId)
}

async function retrieveRankings() {
  try {
    const res = await axios.get('http://localhost:3000/api/rankings')
    console.log(res.data)
    showErrorOrSuccess.value = true
    return res.data.ranking
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
</script>

<style scoped>
.specCards {
  display: flex;
  text-align: center;
}
.specCard {
  margin-right: 1em;
}
</style>
