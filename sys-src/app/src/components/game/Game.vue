<template>
    <div class="enemies">
        <h3>enemies</h3>
        <div v-for="enemy in orderedEnemies">
            {{ enemy }}: {{ publicGameMetadata?.cardCountPerPlayer[enemy] }}<br>
        </div>
    </div>
    <div class="table">
        DrawingPile: {{ publicGameMetadata?.drawingPileCount }}<br>
        DiscardPile: {{ publicGameMetadata?.discardPile.length }}<br>
        {{ publicGameMetadata?.discardPile.map(card => `${card.number}${card.color}`).join(', ') }}
        <br><br>
        Current player: {{ publicGameMetadata?.currentPlayerName }}
    </div>
    <div class="player">
        <h3>player</h3>
        {{ userName }}: {{ publicGameMetadata?.cardCountPerPlayer[player || ''] }}<br>
        <div class="hand-cards">
        <!-- {{ handCards?.map(card => `${card.number}${card.color}`).join(', ') }} -->
            <CardFront v-if="handCards" v-for="card in handCards" :value="card.number" :color="card.color" />
        </div>
   </div>
</template>

<script setup lang="ts">
//#region imports
import type { Card } from '@/types/card';
import CardFront from '../game/CardFront.vue';
import { PublicGameMetadata } from '@/types/publicGameMetadata';
import { computed } from 'vue';
//#endregion imports

const props = defineProps({
    userName: String,
    publicGameMetadata: PublicGameMetadata,
    handCards: Array<Card>
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

</script>

<style>
body > div {
    position: absolute;
    inset: 0;
}

.enemies {
    position: absolute;
    inset: 0 0 auto 0;
    
    border: solid 2px turquoise;
    height: 100px;
}

.hand-cards{
    display: flex;
}

.player {
    position: absolute;
    inset: auto 0 0 0;
    
    border: solid 2px orange;
    height: 100px;
}


.table {
    position: absolute;
    inset: 100px 0 100px 0;
    border: solid 2px green;
}
</style>