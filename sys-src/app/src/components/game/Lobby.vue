<template>
  <div>
    <h3>{{ userName }}</h3>
    <hr><br>

    <h2>Create</h2>

    <div>special cards: {{ specialCards }}</div>
    <input type="checkbox" id="seven" value="seven" v-model="specialCards">
    <label for="seven">7</label>
    <input type="checkbox" id="eight" value="eight" v-model="specialCards">
    <label for="eight">8</label>
    <input type="checkbox" id="nine" value="nine" v-model="specialCards">
    <label for="nine">9</label>
    <input type="checkbox" id="ten" value="ten" v-model="specialCards">
    <label for="ten">10</label>
    <input type="checkbox" id="ace" value="ace" v-model="specialCards">
    <label for="ace">ace</label>
    <!-- <br><br> -->

    <div>players: {{ maxPlayers }}</div>
    <input type="radio" id="two" value="2" v-model="maxPlayers" />
    <label for="two">2</label>
    <input type="radio" id="three" value="3" v-model="maxPlayers" />
    <label for="three">3</label>
    <input type="radio" id="four" value="4" v-model="maxPlayers" />
    <label for="four">4</label>

    <br>
    <button @click="createRoom()">Create room</button>

    <br><br>
    <!-- <hr> -->
    <br>
    
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
import type { PublicRoomData } from '@/types/publicRoomData';
import { ref } from 'vue';
//#endregion imports

const specialCards = ref(["seven", "eight", "nine", "ten", "ace"]);
const maxPlayers = ref(2);

const props = defineProps({
  rooms: Array<PublicRoomData>,
  userName: String
});
const emit = defineEmits(['createRoom', 'joinRoom']);


function createRoom() {
  emit('createRoom', specialCards.value, maxPlayers.value);
}

function joinRoom(roomId: string) {
  emit('joinRoom', roomId);
}
</script>