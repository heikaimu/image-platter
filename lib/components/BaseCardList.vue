<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-25 10:42:09
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-28 15:56:05
-->
<template>
  <ul class="flex flex-wrap justify-center gap-6">
    <li v-for="(item, index) in list" :key="id(item)" class="h-24 w-24 relative">
      <img
        class="w-full h-full rounded-full object-contain shadow-lg"
        :src="url(item)"
        @click="handleClick(item)"
      >
      <button
        v-if="closeable"
        type="button"
        class="flex justify-center items-center absolute top-0 right-0 rounded-full bg-red-600 text-white leading-normal uppercase shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out w-6 h-6"
        @click="handleDelete(item, index)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getValue } from '../utils/util'

const props = defineProps({
  list: {
    type: Array as () => any[],
    default: () => [],
  },
  idKey: {
    type: String,
    default: '',
  },
  urlKey: {
    type: String,
    default: '',
  },
  closeable: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits({
  clickImage: null,
  deleteImage: null,
})

const id = computed(() => {
  return function getSrc(item: any): string {
    return getValue(item, props.idKey)[0]
  }
})

const url = computed(() => {
  return function getSrc(item: any): string {
    return getValue(item, props.urlKey)[0]
  }
})

function handleClick(item: any) {
  emits('clickImage', item)
}

function handleDelete(item: any, index: number) {
  emits('deleteImage', item, index)
}

</script>

<style scoped>
</style>
