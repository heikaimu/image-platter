<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-25 10:40:11
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-28 14:07:24
-->
<template>
  <div class="pt-5 flex-1 overflow-y-auto">
    <h2 class="text-center text-lg text-gray-800">
      Photo Cache
    </h2>
    <div class="pt-6">
      <BaseCardList v-if="list[0]" :list="list" url-key="data.avatar" v-bind="$attrs" />
      <BaseEmpty v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseCardList from '../../BaseCardList.vue'
import BaseEmpty from '../../BaseEmpty.vue'
defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>

</style>
