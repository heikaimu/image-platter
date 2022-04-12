<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-25 15:52:49
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-04-12 16:19:08
-->
<template>
  <div class="py-4 flex items-center justify-center gap-4">
    <BaseButtonIcon @click="emits('scale', 1)">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </BaseButtonIcon>
    <BaseButtonIcon @click="emits('scale', -1)">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
      </svg>
    </BaseButtonIcon>
    <BaseButtonIcon @click="emits('scale', 0)">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </BaseButtonIcon>
  </div>
  <div class="px-4 py-2 flex justify-between border-t border-gray-200">
    <BaseButton type="light" @click="emits('cancel')">
      cancel
    </BaseButton>
    <BaseButton @click="emits('confirm')">
      confirm
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButtonIcon from '../../../components/BaseButtonIcon.vue'
import BaseButton from '../../../components/BaseButton.vue'
const emits = defineEmits({
  scale: null,
  cancel: null,
  confirm: null,
})
</script>

<style scoped>

</style>
