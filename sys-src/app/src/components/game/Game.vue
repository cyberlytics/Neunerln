<template>
    <div class="enemies">
        <h3>enemies</h3>
        <div v-for="enemy in orderedEnemies">
            <div>{{ enemy }}:</div>
            <div class="enemies-handcards"><CardFront class="enemiesCards" :back="cardBack" v-for="card in publicGameMetadata?.cardCountPerPlayer[enemy]"/></div>
        </div>
    </div>
    <div class="table">
        <h3>pile</h3>
        <div class="drawPile">
            <div>DrawingPile: {{ publicGameMetadata?.drawingPileCount }}<br></div>&nbsp;
            <div>DiscardPile: {{ publicGameMetadata?.discardPile.length }}<br></div>
        </div>
        <div class="discard-pile">
            <div>
                <!-- <CardFront class="drawingCards" :back="cardBack" v-for="card in publicGameMetadata?.drawingPileCount"
                @click="drawCard(card)"/> -->

                <CardFront class="drawingCards" :back="cardBack" @click="drawCard()"/>
            </div>
            <div class="discardPile">
                <CardFront class="drawingCards" v-for="card in publicGameMetadata?.discardPile" :value="card.number" :color="card.color" />
            </div>
        </div>
    </div>
    <br>
    Current player: {{ publicGameMetadata?.currentPlayerName }}<br>

    <div class="player">
        <h3>player</h3>
        {{ userName }}: {{ publicGameMetadata?.cardCountPerPlayer[player || ''] }}<br>
        <div class="hand-cards">
            <CardFront class="playerCards" v-if="handCards" v-for="card in handCards" :value="card.number" :color="card.color"
                @click="playCard(card)"/>
        </div>
    </div>

    <button v-if="!playerIsReady" @click="setReadyState">Ready</button>
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
body > div {
    position: absolute;
    inset: 0;
}



.discardPile {
    position: relative;
    left: 9rem;
}


.hand-cards, .enemies-handcards{
    display: flex;
}

.drawPile {
    display: flex;
}

.card.drawingCards {
    position: absolute;
}

.enemiesCards, .playerCards {
    margin-right: -50px;
}
</style>