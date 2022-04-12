<!--
 * @Author: Yaowen Liu
 * @Date: 2022-03-11 16:26:27
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-04-12 18:00:02
-->
<template>
  <button @click="visible = true">
    打开
  </button>
  <RoleCustom v-if="visible" @close="visible = false" />
</template>

<script>
import { ref } from 'vue'
import { RoleCustom } from '../../lib/index'

export default {
  components: {
    RoleCustom,
  },

  setup() {
    const visible = ref(false)
    return {
      visible,
    }
  },
}
</script>
