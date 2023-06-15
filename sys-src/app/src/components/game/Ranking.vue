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
          <slot name="header">default header</slot>
        </div>

        <div class="ranking-body">
          <slot name="body">default body</slot>
        </div>

        <div class="ranking-footer">
          <slot name="footer">
            default footer
            <button class="ranking-default-button" @click="$emit('close')">OK</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>
