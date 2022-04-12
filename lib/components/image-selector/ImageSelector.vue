<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-24 16:24:38
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-04-01 15:46:08
-->
<template>
  <div class="w-full h-full flex flex-col bg-white">
    <BaseHeaderTitle text="Choose Photos Source" @close="emits('close')" />
    <div class="flex-1 overflow-hidden">
      <!-- 图片选择 -->
      <FileSelect v-if="step === STEP.select" :cache-list="cacheList" @select="handleSelectImage" @cache-select="handleUseImageFile" @delete="deleteCache" />
      <!-- 图片预览 -->
      <ImageView v-if="step === STEP.view" :raw-data-url="rawDataUrl" @confirm="handleImage" @step="handleStep" />
      <!-- 图片裁剪 -->
      <ImageCrop v-if="step === STEP.crop" :raw-data-url="rawDataUrl" @confirm="handleImage" @step="handleStep" />
      <!-- ai -->
      <ImageAIHandler v-if="step === STEP.ai" :url="handleUrl" @save="handleSaveAvatar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue'
import type { File } from '../../types/types'
import BaseHeaderTitle from '../BaseHeaderTitle.vue'
import { IMAGE_STEP } from '../../config'
import { useCache } from '../../use'
import { randomID } from '../../utils/util'
import { loadImage } from '../../utils/image'
import FileSelect from './FileSelect.vue'
import ImageCrop from './ImageCrop.vue'
import ImageView from './ImageView.vue'
import ImageAIHandler from './ImageAI.vue'

const { cacheList, deleteCache, addCache } = useCache()

const emits = defineEmits({
  close: null,
  select: null,
})

// 所有步骤
const STEP = reactive(IMAGE_STEP)

// 当前步骤
const step = ref(STEP.select)

// 前往
function handleStep(val: string) {
  step.value = val
}

// 使用头像
function handleUseImageFile(imageFile: File.Image) {
  emits('select', imageFile)
}

// 原图
const rawDataUrl = ref('')

// 选择图片
function handleSelectImage(data: string) {
  rawDataUrl.value = data
  step.value = STEP.view
}

// 保存头像
async function handleSaveAvatar(avatar: File.Picart) {
  const { url, chin } = toRaw(avatar)
  const image = await loadImage(url)
  const imageFile: File.Image = {
    id: randomID(),
    data: {
      raw: rawDataUrl.value,
      avatar: url,
      chin,
      width: image.width,
      height: image.height,
    },
  }
  addCache(imageFile)
  handleUseImageFile(imageFile)
}

// 操作的图片
const handleUrl = ref('')

// 操作图片完成，旋转或者裁剪
function handleImage(dataUrl: string) {
  handleUrl.value = dataUrl
  step.value = STEP.ai
}
</script>

<style scoped>
</style>
