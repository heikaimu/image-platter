<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-25 15:24:19
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-29 10:26:58
-->
<template>
  <div class="flex flex-col h-full">
    <div class="flex-none p-4">
      <BaseNotice text="AI image cropping is mainly for preview.NOT FINAL DESIGN! Our designer will finalize the perfect fit!" />
    </div>
    <div class="flex-grow overflow-hidden">
      <img id="cropImage" class="max-w-full max-h-full" :src="viewUrl" alt="">
    </div>
    <div class="flex-none">
      <CropperFooterBar @scale="handleScale" @confirm="handleConfirm" @cancel="handleCancel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import Cropper from 'cropperjs'
import BaseNotice from '../BaseNotice.vue'
import { IMAGE_STEP } from '../../config'
import CropperFooterBar from './components/CropperFooterBar.vue'
import './cropper.css'

const props = defineProps({
  rawDataUrl: {
    type: String,
    default: '',
  },
})

const emits = defineEmits({
  confirm: null,
  step: null,
})

const viewUrl = ref(props.rawDataUrl)

// 所有步骤
const STEP = reactive(IMAGE_STEP)

// 裁剪对象
let cropper: Cropper | null = null

// 初始化
function initCropper() {
  const image = document.getElementById('cropImage') as HTMLImageElement
  cropper = new Cropper(image, {
    // aspectRatio: 1,
    autoCropArea: 0.9,
    viewMode: 2,
    dragMode: 'move', // 图片可移动
  })
}

onMounted(() => {
  initCropper()
})

// 保存
function handleConfirm() {
  if (!cropper)
    return

  const dataUrl = cropper.getCroppedCanvas().toDataURL('image/jpeg')
  emits('confirm', dataUrl)
}

// 缩放
function handleScale(val: number) {
  if (!cropper)
    return

  if (val === 0) {
    cropper.reset()
    return
  }

  cropper.zoom(val / 10)
}

// 取消
function handleCancel() {
  emits('step', STEP.view)
}
</script>

<style scoped>

</style>
