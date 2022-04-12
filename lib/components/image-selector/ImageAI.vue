<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-28 10:57:18
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-04-12 15:43:10
-->
<template>
  <div class="p-4 bg-white flex flex-col justify-center items-center h-full">
    <div class="pb-10 text-base">
      <p class="text-center text-lg" :class="color(status)">
        {{ status }}
      </p>
      <p v-if="showAvatars" class="text-center text-x text-gray-600">
        AI select 3 avatar, whitch one you want to use?
      </p>
    </div>
    <BaseCardList :list="avatars" url-key="url" :closeable="false" @click-image="handleClickImage" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { getAIAvatar } from '../../api/picart'
// import BaseNotice from '../BaseNotice.vue'
import BaseCardList from '../BaseCardList.vue'
import { AI_STATUS, IMAGE_STEP } from '../../config'
import type { File } from '../../types/types'

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
})

const emits = defineEmits({
  save: null,
  step: null,
})

const STEP = reactive(IMAGE_STEP)

const avatars = ref<File.Picart[]>([])

const status = ref(AI_STATUS.wait)

const color = computed(() => {
  const map = {
    [AI_STATUS.wait]: 'text-gray-200',
    [AI_STATUS.pending]: 'text-yellow-600',
    [AI_STATUS.success]: 'text-green-600',
    [AI_STATUS.error]: 'text-red-600',
  }
  return function getColor(val: string) {
    return map[val]
  }
})

const showAvatars = computed(() => {
  return status.value === AI_STATUS.success && avatars.value.length > 1
})

/*
AI分析图片
没有结果则返回
有结果：
  一张头像直接提交
  多张头像则出现列表选择
*/
async function AIHandle() {
  setStatus(AI_STATUS.pending)
  const res = await getAIAvatar(props.url)
  if (!res) {
    setStatus(AI_STATUS.error)
    emits('step', STEP.view)
  }
  else {
    setStatus(AI_STATUS.success)
    if (res.length === 1) saveAvatar(res[0])
    else
      avatars.value = res
  }
}

onMounted(() => {
  AIHandle()
})

function handleClickImage(item: File.Picart) {
  saveAvatar(item)
}

function saveAvatar(avatar: File.Picart) {
  emits('save', avatar)
}

function setStatus(val: string) {
  status.value = val
}
</script>

<style scoped>

</style>
