<script setup lang="ts">
const props = defineProps({
  show: Boolean
})
</script>

<template>
  <Transition name="ranking">
    <div v-if="show">
      <div class="ranking-container">
        <div class="ranking-header">
          <slot name="header">Ranking</slot>
        </div>

        <div class="ranking-body">
          <slot name="body">
            <div class="ranking-entry">
              <div>Rank</div>
              <div>Username</div>
              <div>Wins</div>
              <div>Games</div>
              <div>Winrate</div>
            </div>
          </slot>
        </div>

        <div class="ranking-footer">
          <slot name="footer">
            <button class="ranking-default-button" @click="$emit('close')">OK</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.ranking-container {
  border: solid;
  border-radius: 1vw;
  position: absolute;
  z-index: 2;
  top: 10vh;
  left: 10vw;
  width: 80vw;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ranking-header {
  margin-top: 3vh;
  margin-bottom: 3vh;
}
.ranking-footer {
  margin-top: 3vh;
  margin-bottom: 1vh;
}
.ranking-body {
  width: 100%;
}
.ranking-entry {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  justify-items: center;
  margin-bottom: 1vh;
}
</style>
