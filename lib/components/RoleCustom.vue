<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-16 15:03:35
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-04-12 18:01:49
-->
<template>
  <div class="fixed inset-0 flex justify-center items-center">
    <div class="w-full h-full">
      <ImageSelector v-if="curStep===STEP.imageSelect" @close="handleClosePlugin" @select="handleSelectImageFile" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue'
import type { File } from '../types/types'
import { CUSTOM_STEP } from '../config'
import ImageSelector from './image-selector/ImageSelector.vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => {},
  },
})

const emits = defineEmits({
  close: null,
})

onMounted(() => {
  // console.log(props.config)
})

// 定制步骤
const STEP = reactive(CUSTOM_STEP)

const curStep = ref(CUSTOM_STEP.imageSelect)

function setStep(val: string) {
  curStep.value = val
}

// 文件选择
const imageFileList = ref<File.Image[]>([])
provide('imageFileList', imageFileList)

function handleSelectImageFile(imageFile: File.Image) {
  imageFileList.value.push(imageFile)
  setStep(CUSTOM_STEP.bodyCustom)
}

// 关闭插件
function handleClosePlugin() {
  emits('close')
}
</script>

<style>

</style>
