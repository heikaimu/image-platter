/*
 * @Author: Yaowen Liu
 * @Date: 2022-03-28 14:19:28
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-04-01 15:45:22
 */
import { nextTick, onMounted, ref, toRaw } from 'vue'
import localforage from 'localforage'
import type { File } from '../types/types'

export function useCache() {
  // 缓存列表
  const cacheList = ref<File.Image[]>([])

  onMounted(() => {
    getList()
  })

  function getList() {
    localforage.getItem('avatarList').then((res: any) => {
      if (res)
        cacheList.value = res
    })
  }

  // 添加缓存图片
  async function addCache(item: File.Image) {
    cacheList.value.push(item)
    await nextTick()
    localforage.setItem('avatarList', toRaw(cacheList.value))
  }

  // 删除缓存图片
  async function deleteCache(item: File.Image, index: number) {
    cacheList.value.splice(index, 1)
    await nextTick()
    localforage.setItem('avatarList', toRaw(cacheList.value))
  }

  return {
    cacheList,
    addCache,
    deleteCache,
  }
}
