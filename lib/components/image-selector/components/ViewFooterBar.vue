<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-25 15:52:49
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-28 09:59:29
-->
<template>
  <div class="px-4 py-2 flex justify-between">
    <BaseButton type="light" @click="emits('back')">
      replace
    </BaseButton>
    <BaseButton type="primary" @click="emits('confirm')">
      confirm
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../../../components/BaseButton.vue'

const emits = defineEmits({
  back: null,
  confirm: null,
})
</script>

<style scoped>

</style>
