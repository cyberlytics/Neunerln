<template>
  <div id="lobby">
    <h3>{{ userName }}</h3>
    <hr />
    <br />

    <button id="showRankings" @click="toggleModal()">Rankings</button>
    <dialog>
      <Ranking :showModal="showModal" @closeModal="toggleModal" :userName="userName"></Ranking>
    </dialog>

    <h2>Raum erstellen</h2>

    <div>Spezialkarten:</div>
    <div class="specCards">
      <div class="specCard">
        <CardFront class="card-lobby"
          value="7"
          descrip="Der nächste Spieler muss zwei Karten vom Ziehstapel ziehen. Er kann allerdings selbst eine 7 auf die zuvor Gespielte legen."
        />
        <input type="checkbox" id="seven" value="seven" v-model="specialCards" />
      </div>
      <div class="specCard">
        <CardFront class="card-lobby"
          value="8"
          descrip="Der nächste Spieler muss aussetzen und der darauffolgende Spieler kommt an die Reihe."
        />
        <input type="checkbox" id="eight" value="eight" v-model="specialCards" />
      </div>
      <div class="specCard">
        <CardFront class="card-lobby"
          value="9"
          descrip="Diese Karte darf auf jede Karte gelegt werden, unabhängig von Farbe oder Zahl. Der Spieler darf sich eine Farbe wünschen."
        />
        <input type="checkbox" id="nine" value="nine" v-model="specialCards" />
      </div>
      <div class="specCard">
        <CardFront class="card-lobby"
          value="10"
          descrip="Der Spieler darf eine Karte verdeckt an einen Mitspieler weitergeben, der diese aufnehmen muss."
        />
        <input type="checkbox" id="ten" value="ten" v-model="specialCards" />
      </div>
      <div class="specCard">
        <CardFront class="card-lobby" value="A" descrip="Der Spieler ist direkt noch einmal an der Reihe." />
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

    <div>Spieler:</div>
    <input type="radio" id="two" value="2" v-model="maxPlayers" />
    <label for="two">2</label>
    <input type="radio" id="three" value="3" v-model="maxPlayers" />
    <label for="three">3</label>
    <input type="radio" id="four" value="4" v-model="maxPlayers" />
    <label for="four">4</label>

    <br />
    <button @click="createRoom()">Raum erstellen</button>

    <br /><br />
    <!-- <hr> -->
    <br />

    <h2>Offene Räume</h2>
    <ul>
      <li v-for="room in props.rooms" :key="room.id">
        <div>Name: {{ room.name }}</div>
        <div>Spezialkarten: {{ room.specialCards }}</div>
        <div>Spieler: {{ room.currentPlayers }}/{{ room.maxPlayers }}</div>
        <button @click="joinRoom(room.id)">Raum beitreten</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
//#region imports
import type { PublicRoomData } from '@/types/publicRoomData'
import CardFront from '../game/CardFront.vue'
import Ranking from '../game/Ranking.vue'
import { ref } from 'vue'
//#endregion imports

const specialCards = ref(['seven', 'eight', 'nine', 'ten', 'ace'])
const maxPlayers = ref(2)
const showErrorOrSuccess = ref(true)
const errorState = ref('')
const showModal = ref(false)

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

function toggleModal() {
  showModal.value = !showModal.value
  if (showModal.value) {
    document.querySelector('dialog')?.showModal()
  } else {
    document.querySelector('dialog')?.close()
  }
}
</script>

<style scoped>
#lobby {
  position: absolute;
  inset: 0;
  overflow-y: scroll;
  padding-left: 20px;
  background: url("../../assets/table.jpg");
  background-size: cover;
  color: white;
  font-size: large;
}

.specCards {
  display: flex;
  text-align: center;
  color: black;
}
.specCard {
  margin-right: 1em;
}

dialog {
  border: solid;
  border-radius: 1vw;
  width: 80vw;
  background: white;
}
.card-lobby {
  position: relative;
}
</style>
