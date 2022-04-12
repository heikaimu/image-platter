<!--
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-16 14:28:55
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-28 11:26:38
-->
<template>
  <div class="h-12 flex justify-center items-center bg-white z-10 shadow-md">
    <div class="absolute left-0 top-0 z-10 w-12 h-12 flex justify-center items-center cursor-pointer text-gray-800 active:text-red-500" @click="$emit('close')">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="text-lg text-gray-800">
      {{ text }}
    </div>
    <div class="slot-wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: '212',
  },
})

defineEmits({
  close: null,
})
</script>
