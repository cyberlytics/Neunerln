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
          <div>
            <div>Rank</div>
            <div>Username</div>
            <div>Wins</div>
            <div>Games</div>
            <div>Winrate</div>
          </div>
          <div>
            <div>#1</div>
            <div>FastDiscard</div>
            <div>2</div>
            <div>3</div>
            <div>66.66%</div>
          </div>
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
