<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-25 16:40:26
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-28 15:40:55
-->
<template>
  <div class="flex flex-col h-full">
    <div class="p-4 flex-1 flex flex-col justify-center items-center bg-gray-200">
      <div style="padding-bottom: 100%;" class="w-full h-0 m-10 relative">
        <div class="flex justify-center items-center p-2 absolute left-0 top-0 bottom-0 right-0 bg-white rounded-lg shadow-md">
          <img id="cropImage" class="block max-w-full max-h-full" :src="viewUrl" alt="">
        </div>
      </div>
      <ViewMediumBar @crop="emits('step', STEP.crop)" @rotate="handleRotate" />
    </div>
    <ViewFooterBar @back="emits('step', STEP.select)" @confirm="handleConfirm" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { compressAndRotateDataURL } from '../../utils/image'
import { IMAGE_STEP } from '../../config'
import ViewMediumBar from './components/ViewMediumBar.vue'
import ViewFooterBar from './components/ViewFooterBar.vue'

const props = defineProps({
  rawDataUrl: {
    type: String,
    default: '',
  },
})

const emits = defineEmits({
  step: null,
  back: null,
  confirm: null,
})

const STEP = reactive(IMAGE_STEP)

const viewUrl = ref<string>(props.rawDataUrl)

async function handleRotate(flag: boolean) {
  await nextTick()
  viewUrl.value = await compressAndRotateDataURL({
    url: viewUrl.value,
    angle: flag ? 90 : -90,
    quality: 1,
    targetSize: 1000,
  })
}

function handleConfirm() {
  emits('confirm', viewUrl.value)
}
</script>

<style scoped>

</style>
