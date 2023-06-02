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
         <!-- {{ publicGameMetadata?.discardPile.map(card => `${card.number}${card.color}`).join(', ') }}  -->
                <CardFront class="drawingCards" :back="cardBack" v-for="card in publicGameMetadata?.drawingPileCount"/>
            </div>
            <div class="discardPile">
                <CardFront v-for="card in publicGameMetadata?.discardPile" :value="card.number" :color="card.color" />
            </div>
    </div>
        <br><br>
        Current player: {{ publicGameMetadata?.currentPlayerName }}<br>
    
     

        
    </div>
    <div class="player">
        <h3>player</h3>
        {{ userName }}: {{ publicGameMetadata?.cardCountPerPlayer[player || ''] }}<br>
        <div class="hand-cards">
        <!-- {{ handCards?.map(card => `${card.number}${card.color}`).join(', ') }} -->
            <CardFront class="playerCards" v-if="handCards" v-for="card in handCards" :value="card.number" :color="card.color"  />
        </div>
   </div>

   <div class="options" v-if="props.publicGameMetadata?.currentPlayerName == userName">
        <h3>options</h3>
        
        <button @click="endRound()">End Round</button>
        
   </div>
</template>

<script setup lang="ts">
//#region imports
import type { Card } from '@/types/card';
import CardFront from '../game/CardFront.vue';
import { PublicGameMetadata } from '@/types/publicGameMetadata';
import { computed } from 'vue';
import { PublicRoomData } from '@/types/publicRoomData';
import { io } from 'socket.io-client';





//#endregion imports

const cardBack= '../src/assets/card_back.svg';


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



//const emit = defineEmits(['nextPlayer']);
const socket = io('127.0.0.1:3000');

function endRound() {

//console.log(currentRoomId?.value);
  socket.emit('nextPlayer', props.publicGameMetadata?.players, props.publicGameMetadata?.currentPlayerName);
    //console.log("Fucks given");
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

.enemies {
    /* position: absolute;
    inset: 0 0 150px 0; */
    border: solid 2px turquoise;
    /* height: 150px; */
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

.player {
    /* position: absolute;
    inset: 475px 0 0 0; */
    
    border: solid 2px orange;
    /* height: fit-content; */
}


.table {
    /* position: absolute;
    inset: 150px 0 0 0; */
    border: solid 2px green;
    /* height: 325px;*/
} 

.options {
    /* position: absolute;
    inset: 780px 0 0 0; */
    
    border: solid 2px blue;
    /* height: 150px; */
}
</style>