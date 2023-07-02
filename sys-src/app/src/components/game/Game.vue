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
                <CardFront class="drawingCard" :back="cardBack"
                @click="drawCard()"/>
                <span>{{ publicGameMetadata?.drawingPileCount }}</span>
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

    <button class="readyGame" v-if="!playerIsReady" @click="setReadyState(true)">Ready</button>
</template>

<script setup lang="ts">
//#region imports
import type { Card } from '@/types/card';
import CardFront from '../game/CardFront.vue';
import type { PublicGameMetadata } from '../../types/publicGameMetadata';
import { computed, ref } from 'vue';
//#endregion imports

const cardBack= 'https://uc308e5abe654bb56e2ab601d638.previews.dropboxusercontent.com/p/thumb/AB92cKgG_opRKZeEMM8VUafQ24o0byqW1n18LxuHId4s1YX3vROftUXRQhJwlEGFSwijv7pLmB8fwh3ZmZeRWJ7-T8O9MSIqEYidK6-UbIqnDjYNX0aA1ul-Jc6JifzPgEFNpN0voLpVU21N1iKFPPlg_7uy3gZck4fU-WICLKIWYPYG04gQZF4PToz74LIvY81XGw6YKU9hNpDopFz93PJmo4b2rsNKIvMPvGePupczS3OoogqirR8jKPYGhMQ7WvM-Adi5WuTGwNwaF-DQx68KTpCbnoB6JV4aiqCdA8Vcx6yNeSyOkVkeQREOaPICZtSzRPwm8lqScB39BshfV4jTDsYSOACmIEUUTK4bu_xPfpB-BPVuVySUvZGEBUaavj0/p.png';




const props = defineProps({
    userName: String,
    publicGameMetadata: Object, // declaring as PublicGameMetadata gives type warnings, idk why O.o
    handCards: Array<Card>,
    playerIsReady: Boolean
});

const player = computed(() => {
    return (<PublicGameMetadata>props.publicGameMetadata).players
        .find((playerName) => playerName == props.userName);
});

const unorderedEnemies = computed(() => {
    if (player.value == undefined) {
        return;
    }

    const enemies = (<PublicGameMetadata>props.publicGameMetadata).players
        .filter((playerName) => playerName != props.userName);
    
    return enemies;
});

const orderedEnemies = computed(() => {
    if (player.value == null
        || unorderedEnemies.value == null) {
        return;
    }

    const playerIndex = (<PublicGameMetadata>props.publicGameMetadata).players.indexOf(player.value);
    const enemiesBeforePlayer = unorderedEnemies.value.slice(0, playerIndex);
    const enemiesAfterPlayer = unorderedEnemies.value.slice(playerIndex);

    const enemies = enemiesAfterPlayer.concat(enemiesBeforePlayer);
    return enemies;
});

const emit = defineEmits(['cardPlayed', 'cardDrawn', 'setReadyState', 'ten', 'color']);

function playCard(card: Card) {
  emit('cardPlayed', card);
}


function drawCard() {
  emit('cardDrawn');
}

function setReadyState(state: boolean) {
    emit('setReadyState', state);
};
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
.draws > span {
    position: absolute;
    inset: -25px auto auto 4rem;
    text-align: center;
    font-size: larger;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    translate: -50% 0;

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
    transform: translate(-197.026px, -80.7771px) rotate(-5.625deg) scale(1, 1);
}
.hand-cards .playerCards:nth-child(2), .enemies-handcards .enemiesCards:nth-child(2) {
    transform: translate(-138.306px, -85.3984px) rotate(-3.375deg) scale(1, 1);
}
.hand-cards .playerCards:nth-child(3), .enemies-handcards .enemiesCards:nth-child(3) {
    transform: translate(-79.4505px, -87.7109px) rotate(-1.125deg) scale(1, 1);
}   
.hand-cards .playerCards:nth-child(4), .enemies-handcards .enemiesCards:nth-child(4) {
    transform: translate(-20.5495px, -87.7109px) rotate(1.125deg) scale(1, 1);
}
.hand-cards .playerCards:nth-child(5), .enemies-handcards .enemiesCards:nth-child(5) {
    transform: translate(38.3062px, -85.3984px) rotate(3.375deg) scale(1, 1);
}
.hand-cards .playerCards:nth-child(6), .enemies-handcards .enemiesCards:nth-child(6) {
    transform: translate(97.0257px, -80.7771px) rotate(5.625deg) scale(1, 1);
}
.hand-cards .playerCards:nth-child(7), .enemies-handcards .enemiesCards:nth-child(7) {
    transform: translate(-197.026px, -10.7771px) rotate(-5.625deg) scale(1, 1);
}
.hand-cards .playerCards:nth-child(8), .enemies-handcards .enemiesCards:nth-child(8) {
    transform: translate(-138.306px, -15.3984px) rotate(-3.375deg) scale(1, 1);
}
.hand-cards .playerCards:nth-child(9), .enemies-handcards .enemiesCards:nth-child(9) {
    transform: translate(-79.4505px, -17.7109px) rotate(-1.125deg) scale(1, 1);
}   
.hand-cards .playerCards:nth-child(10), .enemies-handcards .enemiesCards:nth-child(10) {
    transform: translate(-20.5495px, -17.7109px) rotate(1.125deg) scale(1, 1);
}
.hand-cards .playerCards:nth-child(11), .enemies-handcards .enemiesCards:nth-child(11) {
    transform: translate(38.3062px, -15.3984px) rotate(3.375deg) scale(1, 1);
}
.hand-cards .playerCards:nth-child(12), .enemies-handcards .enemiesCards:nth-child(12) {
    transform: translate(97.0257px, -10.7771px) rotate(5.625deg) scale(1, 1);
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
    inset: auto auto 20px 50%;
    translate: -50%;
}
</style>