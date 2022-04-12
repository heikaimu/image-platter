<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-28 10:12:16
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-28 10:51:27
-->
<template>
  <button
    type="button"
    class="flex justify-center items-center rounded-full leading-tight uppercase shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-9 h-9"
    :class="[typeClass]"
    @click="emits('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  // 尺寸
  size: {
    type: String,
    default: 'base',
  },
  // type
  type: {
    type: String,
    default: 'primary',
  },
})

const emits = defineEmits({
  click: null,
})

const typeClass = computed(() => {
  if (props.type === 'danger')
    return 'bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 active:bg-red-800'

  else if (props.type === 'light')
    return 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-400'

  else if (props.type === 'dark')
    return 'bg-gray-800 text-white hover:bg-gray-900 focus:bg-gray-900 active:bg-gray-900'

  else
    return 'bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800'
})
</script>

<style scoped>
</style>
