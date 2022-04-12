<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-28 10:30:47
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-04-12 15:25:02
-->
<template>
  <button
    type="button"
    class="flex items-center font-bold leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
    :class="[typeClass, sizeClass]"
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
  // plain
  plain: {
    type: Boolean,
    dafault: false,
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

const sizeClass = computed(() => {
  if (props.size === 'large')
    return 'px-7 py-3 text-sm'

  else if (props.size === 'small')
    return 'px-4 py-1.5 text-xs'

  else
    return 'px-6 py-2.5 text-xs'
})
</script>

<style scoped>
</style>
