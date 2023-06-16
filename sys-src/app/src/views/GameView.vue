<template>
    <div v-if="onScreenMessageVisible" class="onScreenMessage">{{ onScreenMessage }}</div>
    <div v-if="ChooseColorVisible" class="onScreenMessage">{{ onScreenMessage }}</div>
    <div class="NineColor" v-if="chooseAColor">
        <button  @click="NineColor('Schellen')">Schellen</button>
        <button  @click="NineColor('Eichel')">Eichel</button>
        <button  @click="NineColor('Blatt')">Blatt</button>
        <button  @click="NineColor('Herz')">Herz</button>
    </div>
    <div v-if="onFinishMessageVisible" class="onFinishMessage">{{ onFinishMessage }}</div>
    <Lobby v-if="!currentRoomId"
      :rooms="roomData" :userName="userName"
      @createRoom="createRoom" @joinRoom="joinRoom"
    />
    <Game v-else
      :userName="userName" :publicGameMetadata="publicGameMetadata" :handCards="handCards"
      @cardPlayed="cardPlayed" @cardDrawn="cardDrawn" @ready="ready" @Color="NineColor"
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

const onScreenMessage = ref('');
const onScreenMessageVisible = ref(false);
const ChooseColorVisible = ref(false);
const chooseAColor = ref(false);

const onFinishMessage = ref('');
const onFinishMessageVisible = ref(false);

//#region subscribe

socket.on(SocketRoom.lobbyRoomsChanged, (openRooms: PublicRoomData[]) => {
  roomData.value = openRooms;
});

socket.on(SocketRoom.gameStarted, () => {
  // do something
});

socket.on(SocketRoom.gamedataPublished, (gameMetadata: PublicGameMetadata) => {
  publicGameMetadata.value = gameMetadata;
  
  socket.emit(SocketRoom.handcardsRequested, currentRoomId.value);
});

socket.on(SocketRoom.handCardsPublished, (cards: Card[]) => {
  handCards.value = cards;
});

socket.on(SocketRoom.cardMoveFeedback, (message: string) => {
  showOnScreenMessage(message);
});


//#endregion subscribe

//#region publish

function createRoom(specialCards: string[], maxPlayers: number) {
  socket.emit(
    SocketRoom.roomCreated, 
    userName.value, specialCards, maxPlayers
  );

  joinRoom(socket.id);
}

function joinRoom(roomId: string) {
  currentRoomId.value = roomId;

  socket.emit(
    SocketRoom.roomJoined,
    roomId, userName.value
  );
}

function cardPlayed(card: Card) {
  // sent move to backend
  socket.emit(
    SocketRoom.playCard,
    currentRoomId.value, card
  );
}

function cardDrawn(card: Card) {
  // sent move to backend
  socket.emit(
    SocketRoom.drawCard,
    currentRoomId.value, card
  );
}

function ready() {
  // sent ready signal to backend
  socket.emit(
    SocketRoom.ready,
    currentRoomId.value
  );
}

function NineColor(color: string){
  //sent Color to backend
chooseAColor.value=false;
  socket.emit(
    SocketRoom.nineColor,
    color, currentRoomId.value
  );
}

//#endregion publish

let timeout: number;
function showOnScreenMessage(message: string) {
  clearTimeout(timeout); // clear previous timeout

  onScreenMessage.value = message;
  onScreenMessageVisible.value = true;

  timeout = setTimeout(() => {
    onScreenMessageVisible.value = false;
  }, 2000);
}

let timeFinish: number;

function showOnFinishMessage(message: string) {
  clearTimeout(timeFinish); // clear previous timeout

  onFinishMessage.value = message;
  onFinishMessageVisible.value = true;

  timeFinish = setTimeout(() => {
    onFinishMessageVisible.value = false;
  }, 5000);
}

// ToDo: remove later on, just for testing purpose
function getRandomName() {
  const randomNumber = Math.floor(Math.random() * 100);
  return `User${randomNumber}`;
}

</script>

<style>

.onScreenMessage {
  position: absolute;
  inset: 50% auto auto 50%;
  translate: -50% -50%;
  z-index: 100;
  padding: 10px;
  border-radius: 30px;

  font-family: 'Courier New', Courier, monospace;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
}

.onFinishMessage {
  position: absolute;
  inset: 50% auto auto 50%;
  translate: -50% -50%;
  font-size: 5vh;
  z-index: 100;
  padding: 30px;
  border-radius: 30px;
  text-align: center;
  color: white;
  background-color: #f29400;
}

</style>