<!--
 * @Date: 2022-04-08 15:46:02
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-04-08 16:40:32
 * @FilePath: /vue3-shopify-custom-plugin/lib/components/BaseScrollLoadList.vue
-->

<template>
  <div class="flex-1 p-2 pb-6 h-full overflow-y-auto">
    <ul class="grid grid-cols-2 gap-x-2 gap-y-6">
      <li v-for="item in curList" :key="item.index">
        <slot :data="item" />
      </li>
    </ul>
    <p
      ref="loadMore"
      class="pt-6 text-center text-sm text-gray-400"
      @click="addMore"
    >
      {{ noMore ? 'End Line' : 'Load More' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  list: {
    type: Array as () => any[],
    default: () => [],
  },
})

const curList = ref<any[]>([])
const pageNum = ref(0)
const pageSize = ref(10)
const noMore = computed(() => {
  return curList.value.length >= props.list.length
})

const loadMore = ref(null)
useIntersectionObserver(
  loadMore,
  ([{ isIntersecting }], observerElement) => {
    addMore()
  },
)

// get page list
function getPageList(): any[] {
  let i = pageNum.value * pageSize.value
  const endIndex = Math.min(props.list.length, i + pageSize.value)
  const list = []
  for (; i < endIndex; i++)
    list.push(props.list[i])

  return list
}

// refresh
async function refresh() {
  pageNum.value = 0
  await nextTick()
  curList.value = getPageList()
}

// load more
async function addMore() {
  if (noMore.value)
    return

  pageNum.value++
  await nextTick()
  curList.value.push(...getPageList())
}

// watch
watch(() => props.list, (val) => {
  refresh()
})
</script>

<style scoped>
</style>
