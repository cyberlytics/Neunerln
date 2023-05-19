<template>
    <Lobby v-if="!currentRoomId"
      :rooms="roomData" :userName="userName"
      @createRoom="createRoom" @joinRoom="joinRoom"
    />
    <Game v-else
      :userName="userName" :publicGameMetadata="publicGameMetadata" :handCards="handCards"
    />
</template>

<script setup lang="ts">
//#region imports
import { ref } from 'vue';
import { io } from 'socket.io-client';
import Lobby from '../components/game/Lobby.vue';
import Game from '../components/game/Game.vue';
import type { Card } from '@/types/card';
import type { PublicGameMetadata } from '@/types/publicGameMetadata';
import type { PublicRoomData } from '@/types/publicRoomData';
import { SocketRoom } from '@/types/socketRoom';
//#endregion imports

const url = 'http://localhost:3000';
const socket = io(url);

const roomData = ref<PublicRoomData[]>();
const currentRoomId = ref<string>();
const publicGameMetadata = ref<PublicGameMetadata>();
const handCards = ref<Card[]>();
const userName = ref<string>(getRandomName());


//#region subscribe

socket.on(SocketRoom.publishOpenRooms, (openRooms: PublicRoomData[]) => {
  roomData.value = openRooms;
});

socket.on(SocketRoom.onStartGame, () => {
  // do something
});

socket.on(SocketRoom.getGameMetadata, (gameMetadata: PublicGameMetadata) => {
  publicGameMetadata.value = gameMetadata;
  
  socket.emit(SocketRoom.requestHandCards, currentRoomId.value);
});

socket.on(SocketRoom.getHandCards, (cards: Card[]) => {
  handCards.value = cards;
});

//#endregion subscribe

//#region publish

function createRoom(specialCards: string[], maxPlayers: number) {
  socket.emit(
    SocketRoom.onCreateRoom, 
    userName.value, specialCards, maxPlayers
  );

  joinRoom(socket.id);
}

function joinRoom(roomId: string) {
  currentRoomId.value = roomId;

  socket.emit(
    SocketRoom.onJoinRoom,
    roomId, userName.value
  );
}

//#endregion publish

// ToDo: remove later on, just for testing purpose
function getRandomName() {
  const randomNumber = Math.floor(Math.random() * 100);
  return `User${randomNumber}`;
}

</script>