<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-24 16:45:43
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-04-12 16:22:32
-->
<template>
  <div class="h-full flex flex-col">
    <FileInput @file-select="handleFileSelect" />
    <ImageCache :list="cacheList" @click-image="handleClickImage" @delete-image="handleDeleteImage" />
  </div>
</template>

<script setup lang="ts">
import type { File } from '../../types/types'
import FileInput from './components/FileInput.vue'
import ImageCache from './components/ImageCache.vue'

defineProps({
  cacheList: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits({
  select: null,
  delete: null,
  cacheSelect: null,
})

/**
 * @description: 文件选择
 * @param {*} dataURL
 * @return {*}
 */
function handleFileSelect(dataURL: string) {
  emits('select', dataURL)
}

// 删除缓存图片
async function handleDeleteImage(item: File.Image, index: number) {
  emits('delete', item, index)
}

// 点击缓存图片
function handleClickImage(item: File.Image) {
  emits('cacheSelect', item)
}
</script>

<style scoped>
</style>
