<template>
    <div class="table">
        <div class="hand hand-cards">
            <CardFront class="hand playerCards" v-if="handCards" v-for="card in handCards" :value="card.number" :color="card.color"
                @click="playCard(card)"/>
        </div>
        <div v-for="enemy in orderedEnemies" class="hand enemies-handcards"><CardFront class="hand enemiesCards" :back="cardBack" v-for="card in publicGameMetadata?.cardCountPerPlayer[enemy]"/></div>
    </div>


    <div class="pile">
        <div class="discard-pile">
            <div class="draws">
                <CardFront class="drawingCard" :back="cardBack" v-for="card in publicGameMetadata?.discardPile"
                @click="drawCard()"/>
            </div>
            <div>
                <CardFront class="drawingCards" v-for="card in publicGameMetadata?.discardPile" :value="card.number" :color="card.color" />
            </div>
        </div>
    </div>
    <br>
    <!--
    Current player: {{ publicGameMetadata?.currentPlayerName }}<br>

     <div class="player">
        <h3>player</h3>
        {{ userName }}: {{ publicGameMetadata?.cardCountPerPlayer[player || ''] }}<br>
        <div class="hand-cards">
            <CardFront class="playerCards" v-if="handCards" v-for="card in handCards" :value="card.number" :color="card.color"
                @click="playCard(card)"/>
        </div>
    </div> -->

    <button class="readyGame" v-if="!playerIsReady" @click="setReadyState">Ready</button>
</template>

<script setup lang="ts">
//#region imports
import type { Card } from '@/types/card';
import CardFront from '../game/CardFront.vue';
import { PublicGameMetadata } from '@/types/publicGameMetadata';
import { computed, ref } from 'vue';
//#endregion imports

const cardBack= '../src/assets/card_back.svg';
const playerIsReady = ref(false);

const props = defineProps({
    userName: String,
    publicGameMetadata: PublicGameMetadata,
    handCards: Array<Card>,
 
});




const player = computed(() => {
    return props.publicGameMetadata?.players
        .find((playerName) => playerName == props.userName);
});

const unorderedEnemies = computed(() => {
    if (player.value == undefined) {
        return;
    }

    const enemies = props.publicGameMetadata?.players
        .filter((playerName) => playerName != props.userName);
    
    return enemies;
});

const orderedEnemies = computed(() => {
    if (player.value == null
        || unorderedEnemies.value == null) {
        return;
    }

    const playerIndex = props.publicGameMetadata?.players.indexOf(player.value);
    const enemiesBeforePlayer = unorderedEnemies.value.slice(0, playerIndex);
    const enemiesAfterPlayer = unorderedEnemies.value.slice(playerIndex);

    const enemies = enemiesAfterPlayer.concat(enemiesBeforePlayer);
    return enemies;
});

const emit = defineEmits(['cardPlayed', 'cardDrawn', 'ready']);


function playCard(card: Card) {
  emit('cardPlayed', card);
}


function drawCard() {
  emit('cardDrawn');
}

function setReadyState() {
    playerIsReady.value = true;
    emit('ready');
}

</script>

<style>

.table {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%,-50%,0);
    overflow: hidden;
    transform: translateX(-50%) translateY(-50%) rotate(180deg);
    background-image: url(../../assets/table.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    
}

.card.drawingCards {
  position: absolute;
}

.card.drawingCard {
    position: absolute;
 
}

.draws {
    margin-right: 25vh;    
}

.discard-pile {
    display: flex;
}

.hand {
    position: absolute;
}

.discardPile {
    position: relative;
    
   
}
.hand-cards{
    top: 0;
    left: 50%;
    transform: rotate(180deg) translateY(-70px);
}


.drawingCards:nth-child(4n+1){
   
    transform: translate(-0.5vh, -0.5vh) rotate(5deg);
}
.drawingCards:nth-child(4n+2){
    transform: translate(-0.5vh, 0.5vh) rotate(-20deg);
}
.drawingCards:nth-child(4n+3){
    transform: translate(0.5vh, -0.5vh) rotate(10deg);
}
.drawingCards:nth-child(4n+4){
    transform: translate(0.5vh, 0.5vh) rotate(-15deg);
}
.drawingCards:first-child{
    transform: rotate(0deg);
}

.enemies-handcards{
    left: 50%;
    bottom: 0;
}
.hand-cards .playerCards:nth-child(1), .enemies-handcards .enemiesCards:nth-child(1) {
    transform: translate(-197.026px, -77.7771px) rotate(-5.625deg) scale(1, 1);
}
.hand-cards .playerCards:nth-child(2), .enemies-handcards .enemiesCards:nth-child(2) {
    transform: translate(-138.306px, -82.3984px) rotate(-3.375deg) scale(1, 1);
}
.hand-cards .playerCards:nth-child(3), .enemies-handcards .enemiesCards:nth-child(3) {
    transform: translate(-79.4505px, -84.7109px) rotate(-1.125deg) scale(1, 1);
}   
.hand-cards .playerCards:nth-child(4), .enemies-handcards .enemiesCards:nth-child(4) {
    transform: translate(-20.5495px, -84.7109px) rotate(1.125deg) scale(1, 1);
}
.hand-cards .playerCards:nth-child(5), .enemies-handcards .enemiesCards:nth-child(5) {
    transform: translate(38.3062px, -82.3984px) rotate(3.375deg) scale(1, 1);
}
.hand-cards .playerCards:nth-child(6), .enemies-handcards .enemiesCards:nth-child(6) {
    transform: translate(97.0257px, -77.7771px) rotate(5.625deg) scale(1, 1);
}

div.enemies-handcards:nth-child(2) {
    top: 50%;
    left: 100%;
    transform: translateX(20vh) translateY(-50%) rotate(270deg);
}

div.enemies-handcards:nth-child(3) {
    transform: translateY(-4.5vh) ;
}

div.enemies-handcards:nth-child(4) {
    top: 50%;
    left: 0%;
    transform: translateX(-20vh) translateY(-50%) rotate(90deg);
}

.card {
    position: absolute;
}

.pile {
    top: 40%;
left: 42%;
position: absolute;
}

.readyGame {
    position: absolute;
}
</style>