/*
 * @Date: 2022-04-08 15:10:32
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-04-08 15:11:07
 * @FilePath: /vue3-shopify-custom-plugin/lib/utils/skin.ts
 */
import type { Body } from '../types/types'

/**
 * @description: 获取肤色
 * @param {Body.SkinImage[]} images
 * @param {string} skin
 * @return {string}
 */
export function getSkinImage(images: Body.SkinImage[], skin: string): string {
  const matchItem = images.find(item => item.color === skin)
  return matchItem ? matchItem.url : ''
}
