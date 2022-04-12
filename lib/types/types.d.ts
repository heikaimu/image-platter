/*
 * @Author: Yaowen Liu
 * @Date: 2022-03-25 13:47:06
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-04-08 15:03:09
 */
// 文件
export namespace File {
  // 图片信息
  interface FileData {
    raw: string
    avatar?: string
    chin?: number[]
    width?: number
    height?: number
  }

  // 选择的图片
  export interface Image {
    id: string
    data: FileData
  }

  // 皮卡AI扣头后的数据
  export interface Picart {
    chin: number[]
    url: string
  }
}

// 身体
export namespace Body {

  // 组导航
  export interface Navigation {
    title: string
    value?: string
    total: number
  }

  // 脸部
  export interface Face {
    angle: number
    configType: 'normal' | 'hood'
    width: number
    height: number
    left: number
    top: number
    type?: string
    name?: string
  }

  // 带肤色的图片
  interface SkinImage {
    color: string
    url: string
  }

  // 附件
  export interface Annex {
    width: number
    angle: number
    top: number
    left: number
    selectable: boolean
    images: SkinImage[]
  }

  // 卡片
  export interface Card {
    id: string
    annex: Annex[]
    avatar: any
    checked: boolean
    face: any
    faceList: Face[]
    width: number
    height: number
    images: SkinImage[]
    index: string
    name: string
    pid: string
    type: string
  }

  // 卡片组
  export interface Group {
    id: string
    name: string
    language: Record<string, string>
    images: Card[]
  }

  interface RenderImage {
    url: string
    width?: number
    height?: number
    offset?: number[]
  }

  // 卡片头像
  export interface CardImage {
    id: string
    image: RenderImage
    width: number
    height: number
    top: number
    left: number
    angle: number
    type?: string
  }
}
