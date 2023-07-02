<template>
  <div v-if="onScreenMessageVisible" class="onScreenMessage">{{ onScreenMessage }}</div>

  <div class="NineColor" v-if="chooseAColor">
    <div class="onScreenMessagestay">{{ onScreenMessagestay }}</div>
    <button @click="NineColor('Schellen')" class="SchellenButton">Schellen</button>
    <button @click="NineColor('Eichel')" class="EichelButton">Eichel</button>
    <button @click="NineColor('Blatt')" class="BlattButton">Blatt</button>
    <button @click="NineColor('Herz')" class="HerzButton">Herz</button>
  </div>
  <div v-if="chooseAPlayer">
    <div class="onScreenMessagestay">{{ onScreenMessagestay }}</div>
    <div class="buttonWrapper">
      <div v-for="item in publicGameMetadata?.players">
        <button class="PlayerButton" v-if="item !== currentUser" @click="playTen(item)">
          {{ item }}
        </button>
      </div>
    </div>
  </div>
  <div v-if="onFinishMessageVisible" class="onFinishMessage">{{ onFinishMessage }}</div>
  <Lobby
    v-if="!currentRoomId"
    :rooms="roomData"
    :userName="userName"
    @createRoom="createRoom"
    @joinRoom="joinRoom"
  />
  <Game
    v-else-if="publicGameMetadata"
    :userName="userName"
    :publicGameMetadata="publicGameMetadata"
    :handCards="handCards"
    :playerIsReady="playerIsReady"
    @cardPlayed="cardPlayed"
    @cardDrawn="cardDrawn"
    @setReadyState="setReadyState"
    @Color="NineColor"
    @Ten="playTen"
  />
  <button id="debug" @click="debug">debug button</button>
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
import Cookies from 'js-cookie'
import { SocketRoom } from '@/types/socketRoom';
//#endregion imports

const url = 'http://35.158.148.247:3000';
// const url = 'http://localhost:3000';
const socket = io(url);

const roomData = ref<PublicRoomData[]>();
const currentRoomId = ref<string>();
const publicGameMetadata = ref<PublicGameMetadata>();
const handCards = ref<Card[]>();
const userName = ref<string>(Cookies.get("username") || getRandomName());
const playerIsReady = ref(false);

const onScreenMessage = ref('')
const onScreenMessagestay = ref('')
const onScreenMessageVisible = ref(false)
const ChooseColorVisible = ref(false)
const chooseAColor = ref(false)
const chooseAPlayer = ref(false)
const currentUser = ref('')

const onFinishMessage = ref('')
const onFinishMessageVisible = ref(false)

const emit = defineEmits(['gameFinished'])

//#region subscribe

socket.on(SocketRoom.lobbyRoomsChanged, (openRooms: PublicRoomData[]) => {
  roomData.value = openRooms
})

socket.on(SocketRoom.roomCreated, (roomId: string) => joinRoom(roomId))

socket.on(SocketRoom.gameStarted, () => {
  // do something
})

socket.on(SocketRoom.gamedataPublished, (gameMetadata: PublicGameMetadata) => {
  publicGameMetadata.value = gameMetadata

  socket.emit(SocketRoom.handcardsRequested, currentRoomId.value)
})

socket.on(SocketRoom.handCardsPublished, (cards: Card[]) => {
  handCards.value = cards
})

socket.on(SocketRoom.cardMoveFeedback, (message: string) => {
  showOnScreenMessage(message)
})

socket.on(SocketRoom.nineColor, (message: string) => {
  chooseAColor.value = true
  onScreenMessagestay.value = message
})

socket.on(SocketRoom.playedTen, (message: string, currentuser: string) => {
  chooseAPlayer.value = true
  currentUser.value = currentuser
  onScreenMessagestay.value = message
})

socket.on(SocketRoom.gameFinishedFeedback, (message: string) => {
  showOnFinishMessage(message)
  setReadyState(false)
})

socket.on(SocketRoom.choosenNineColor, (message: string) => {
  showOnFinishMessage(message)
})

//#endregion subscribe

//#region publish

function createRoom(specialCards: string[], maxPlayers: number) {
  socket.emit(SocketRoom.createRoom, userName.value, specialCards, maxPlayers)
}

function joinRoom(roomId: string) {
  currentRoomId.value = roomId

  socket.emit(SocketRoom.roomJoined, roomId, userName.value)
}

function cardPlayed(card: Card) {
  // sent move to backend
  socket.emit(SocketRoom.playCard, currentRoomId.value, card)
}

function cardDrawn(card: Card) {
  // sent move to backend
  socket.emit(SocketRoom.drawCard, currentRoomId.value, card)
}

function setReadyState(state: boolean) {
  playerIsReady.value = state

  // sent ready signal to backend
  socket.emit(SocketRoom.ready, currentRoomId.value, state)
}

function NineColor(color: string) {
  //sent Color to backend
  chooseAColor.value = false
  socket.emit(SocketRoom.nineColor, color, currentRoomId.value)
}

function playTen(player: string) {
  chooseAPlayer.value = false
  showOnScreenMessage('Wähle eine Karte!')
  socket.emit(SocketRoom.playedTen, player, currentRoomId.value)
}

function debug() {
  socket.emit(SocketRoom.debug, currentRoomId.value)
}

//#endregion publish

let timeout: number
function showOnScreenMessage(message: string) {
  clearTimeout(timeout) // clear previous timeout

  onScreenMessage.value = message
  onScreenMessageVisible.value = true

  timeout = setTimeout(() => {
    onScreenMessageVisible.value = false
  }, 2000)
}

let timeFinish: number

function showOnFinishMessage(message: string) {
  clearTimeout(timeFinish) // clear previous timeout

  onFinishMessage.value = message
  onFinishMessageVisible.value = true

  timeFinish = setTimeout(() => {
    onFinishMessageVisible.value = false
  }, 5000)
}

// ToDo: remove later on, just for testing purpose
function getRandomName() {
  const randomNames: string[] = [
    'Lukas', 'Marie', 'Finn', 'Hannah', 'Leon', 'Laura', 'Paul', 'Manu',
    'Benjamin', 'Mia', 'Jonas', 'Lena', 'Noah', 'Sophie', 'Berkay', 'Kevin',
    'Julian', 'Lea', 'Felix', 'Lara', 'Maximilian', 'Sarah', 'Tim', 'Franzi',
    'Simon', 'Lina', 'Niklas', 'Anna', 'Daniel', 'Johanna', 'David', 'Clara',
    'Philipp', 'Luisa', 'Tom', 'Maja', 'Moritz', 'Manuel', 'Jan', 'Dominik'
  ];

  // get random name
  const randomIndex = Math.floor(Math.random() * randomNames.length);
  const randomName = randomNames[randomIndex];

  return randomName;
}
</script>

<style>
.onScreenMessage {
  position: absolute;
  inset: 35% auto auto 50%;
  translate: -50% -50%;
  z-index: 100;
  padding: 10px;
  border-radius: 30px;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
}

.onScreenMessagestay {
  position: absolute;
  inset: 70% auto auto 50%;
  translate: -50% -50%;
  z-index: 100;
  padding: 10px;
  border-radius: 30px;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
}

.HerzButton {
  position: absolute;
  inset: 78% auto auto 41%;
  translate: -50% -50%;
  z-index: 100;
  padding: 10px;
  border-radius: 30px;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
}

.SchellenButton {
  position: absolute;
  inset: 78% auto auto 48%;
  translate: -50% -50%;
  z-index: 100;
  padding: 10px;
  border-radius: 30px;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
}

.EichelButton {
  position: absolute;
  inset: 78% auto auto 55%;
  translate: -50% -50%;
  z-index: 100;
  padding: 10px;
  border-radius: 30px;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
}
.BlattButton {
  position: absolute;
  inset: 78% auto auto 61%;
  translate: -50% -50%;
  z-index: 100;
  padding: 10px;
  border-radius: 30px;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
}

.PlayerButton {
  padding: 10px;
  border-radius: 30px;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
}

.buttonWrapper {
  position: absolute;
  inset: 78% auto auto 50%;
  translate: -50% -50%;
  z-index: 100;
  gap: 10px;
  display: flex;
  flex-direction: row;
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

#debug {
  position: absolute;
  inset: 0 0 auto auto;
}

.Overlay {
  opacity: 1;
  background: #515151;
  width: auto;
  height: auto;
}
</style>
