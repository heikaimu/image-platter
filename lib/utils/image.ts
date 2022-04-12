/*
 * @Description: 图片工具函数
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-05-07 16:48:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-25 17:36:28
 */

interface ImageReset {
  file: Blob | string
  quality: number
  angle: number
  targetSize?: number
}

interface ImageRotate {
  url: string
  quality: number
  angle: number
  targetSize?: number
}

/**
 * @description: 获取文件本地预览地址
 * @param {Blob} file - 本地文件
 * @return {string}
 */
function getObjectUrl(file: Blob): string {
  let url = ''

  if (window.URL !== undefined)
    url = window.URL.createObjectURL(file)

  else if (window.webkitURL !== undefined)
    url = window.webkitURL.createObjectURL(file)

  return url
}

/**
 * @description: base64转blob
 * @param {string} str - base64字符串
 * @return {Blob | undefined}
 */
function dataURLtoBlob(str: string): Blob | undefined {
  const arr = str.split(',')

  const res = arr[0].match(/:(.*?);/)
  if (!res)
    return

  const mime = res[1]
  const bstr = atob(arr[1]); let n = bstr.length; const u8arr = new Uint8Array(n)
  while (n--)
    u8arr[n] = bstr.charCodeAt(n)

  return new Blob([u8arr], { type: mime })
}

/**
 * @description: bolb转base64
 * @param {Blob} blob - 文件blob
 * @return {Promise<string>}
 */
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = function(e: any) {
      resolve(e.target.result)
    }
  })
}

/**
 * @description: 获取文件大小
 * @param {string} url - 文件地址
 * @return {Promise<number>}
 */
function getFileSize(url: string): Promise<number> {
  return new Promise((resolve) => {
    fetch(url)
      .then(response => response.blob())
      .then((res) => {
        resolve(res.size)
      })
  })
}

/**
 * @description: 通过URL下载
 * @param {string} url - 文件地址
 */
function download(url: string): void {
  const a = document.createElement('a')
  a.download = 'AI'
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * @description: 图片设置
 * @param {Object} option
 * @param {blob|string} option.file - 文件
 * @param {number} option.quality - 质量
 * @param {number} option.targetSize - 目标尺寸
 * @param {number} option.angle - 旋转角度 90 x
 * @return {Promise<string>}
 */
async function imageReset(option: ImageReset): Promise<string> {
  const { file, quality, targetSize, angle } = option
  const url = typeof file === 'object' ? getObjectUrl(file) : file
  const res = await compressAndRotateDataURL({
    url,
    angle,
    quality,
    targetSize,
  })
  return Promise.resolve(res)
}

/**
 * @description: 图片压缩旋转
 * @param {Object} option
 * @param {string} option.url - base64
 * @param {number} option.quality - 质量
 * @param {number} option.targetSize - 目标尺寸
 * @param {number} option.angle - 旋转角度 90 x
 * @return {Promise<string>}
 */
export function compressAndRotateDataURL(options: ImageRotate): Promise<string> {
  const { url, quality, targetSize } = options

  let angle = options.angle
  // 角度处理成360度以内
  angle = angle % 360
  if (angle < 0)
    angle = angle + 360

  // 获取当前方位
  let position = ''
  if (Math.abs(angle % 360) === 0)
    position = 'bottom'

  else if (Math.abs(angle % 270) === 0)
    position = 'right'

  else if (Math.abs(angle % 180) === 0)
    position = 'top'

  else if (Math.abs(angle % 90) === 0)
    position = 'left'

  const ext = url.split(';')[0].replace('data:image/', '')

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let imgWidth = img.width
      let imgHeight = img.height

      // 如果有目标尺寸，先通过宽高比判断长边
      if (targetSize && Math.max(imgWidth, imgHeight) > targetSize) {
        const scale = imgWidth / imgHeight
        if (scale > 1) {
          imgWidth = targetSize
          imgHeight = imgWidth / scale
        }
        else if (scale < 1) {
          imgHeight = targetSize
          imgWidth = imgHeight * scale
        }
      }

      // 绘制图片，或旋转
      let width = imgWidth
      let height = imgHeight
      let left = 0
      let top = 0

      switch (position) {
        case 'bottom':
          width = imgWidth
          height = imgHeight
          left = 0
          top = 0
          break

        case 'left':
          width = imgHeight
          height = imgWidth
          left = width
          top = 0
          break

        case 'top':
          width = imgWidth
          height = imgHeight
          left = width
          top = height
          break

        case 'right':
          width = imgHeight
          height = imgWidth
          left = 0
          top = height
          break

        default:
          break
      }

      const canvas = document.createElement('canvas') as HTMLCanvasElement
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

      canvas.width = width
      canvas.height = height
      ctx.translate(left, top)

      ctx.rotate(Math.PI / 180 * angle)
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight)
      resolve(canvas.toDataURL(`image/${ext}`, quality))
    }
    img.src = url
  })
}

/**
 * @description: 图片亮度对比度调整
 * @param {string} url - base64
 * @param {object} option - 配置
 * @param {number} option.brightness - 亮度
 * @param {number} option.contrast - 对比度
 * @return {Promise<string>}
 */
function colorMatrix(url: string, option: { brightness: number; contrast: number }): Promise<string> {
  const brightness = option.brightness || 0 // 亮度
  const contrast = option.contrast || 1 // 对比度
  const ext = url.split(';')[0].replace('data:image/', '') // 后缀
  return new Promise((resolve) => {
    const image = new Image()
    image.src = url
    image.crossOrigin = 'Anonymous' // 支持跨域图片
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx.drawImage(image, 0, 0, image.width, image.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // 获取米格像素点信息
      for (let p = 0; p < imageData.data.length; p += 4) {
        const R = imageData.data[p]
        const G = imageData.data[p + 1]
        const B = imageData.data[p + 2]

        imageData.data[p] = R * contrast + brightness
        imageData.data[p + 1] = G * contrast + brightness
        imageData.data[p + 2] = B * contrast + brightness
      }

      ctx.putImageData(imageData, 0, 0)

      resolve(canvas.toDataURL(`image/${ext}`, 0.7))
    }
  })
}

/**
 * @description: 裁剪图片
 * @param {HTMLImageElement} image - 图片标签
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @return {string}
 */
function cropImage(image: HTMLImageElement, x: number, y: number, width: number, height: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height)
  return canvas.toDataURL('image/png', 0.9)
}

/**
 * @description: 加载图片
 * @param {string} url - 图片地址
 * @return {Promise<HTMLImageElement>}
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = function() {
      resolve(image)
    }
    image.crossOrigin = 'Anonymous' // 支持跨域图片
    image.src = url
  })
}

/**
 * @description: 加载多张图片
 * @param {string[]} images - 图片地址集合
 * @return {Promise<HTMLImageElement[]>}
 */
function loadImages(images: string[]): Promise<HTMLImageElement[]> {
  const queue = images.map((url) => {
    return loadImage(url)
  })
  return Promise.all(queue).then((res) => {
    return res
  })
}

/**
 * @description: 清除图片周围空白区域
 * @param {string} url - 图片地址或base64
 * @param {number} [padding=0] - 内边距
 * @return {Promise<string>} base64 - 裁剪后的图片字符串
 */
function clearImageEdgeBlank(url: string, padding = 0): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const image = new Image()
    image.onload = function() {
      canvas.width = image.width
      canvas.height = image.height
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      const { data, width, height } = imageData

      // 裁剪需要的起点和终点,初始值为画布左上和右下点互换设置成极限值。
      let startX = width
      let startY = height
      let endX = 0
      let endY = 0

      /*
      col为列，row为行，两层循环构造每一个网格，
      便利所有网格的像素，如果有色彩则设置裁剪的起点和终点
      */
      for (let col = 0; col < width; col++) {
        for (let row = 0; row < height; row++) {
          // 网格索引
          const pxStartIndex = (row * width + col) * 4

          // 网格的实际像素RGBA
          const pxData = {
            r: data[pxStartIndex],
            g: data[pxStartIndex + 1],
            b: data[pxStartIndex + 2],
            a: data[pxStartIndex + 3],
          }

          // 存在色彩：不透明
          const colorExist = pxData.a !== 0

          /*
          如果当前像素点有色彩
          startX坐标取当前col和startX的最小值
          endX坐标取当前col和endX的最大值
          startY坐标取当前row和startY的最小值
          endY坐标取当前row和endY的最大值
          */
          if (colorExist) {
            startX = Math.min(col, startX)
            endX = Math.max(col, startX)
            startY = Math.min(row, startY)
            endY = Math.max(row, endY)
          }
        }
      }

      // 右下坐标需要扩展1px,才能完整的截取到图像
      endX += 1
      endY += 1

      // 加上padding
      startX -= padding
      startY -= padding
      endX += padding
      endY += padding

      // 裁剪后的宽高
      const cWidth = endX - startX
      const cHeight = endY - startY

      // rosolve裁剪后的图像字符串
      resolve(cropImage(image, startX, startY, cWidth, cHeight))
    }

    image.src = url
    image.crossOrigin = 'Anonymous'
  })
}

/**
 * 图片翻转
 * @param {Blob} file - 图片blob或者base64或者链接
 * @param {string} type - 返回的类型，默认base64，可选blob
 * @return {Promise<string | Blob | undefined>}
 */
function flipImage(file: Blob | string, type = 'base64'): Promise<string | Blob | undefined> {
  return new Promise((resolve, reject) => {
    const url = typeof file === 'object' ? getObjectUrl(file) : file

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const image = new Image()
    image.onload = function() {
      canvas.width = image.width
      canvas.height = image.height
      ctx.translate(image.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(image, 0, 0, image.width, image.height)

      const base64 = canvas.toDataURL('image/png', 0.9)
      if (type === 'base64')
        resolve(base64)

      else
        resolve(dataURLtoBlob(base64))
    }
    image.onerror = function() {
      reject(new Error('图片加载失败'))
    }
    image.src = url
    image.crossOrigin = 'Anonymous'
  })
}

export {
  loadImage,
  loadImages,
  getObjectUrl,
  dataURLtoBlob,
  blobToDataURL,
  getFileSize,
  download,
  imageReset,
  colorMatrix,
  cropImage,
  clearImageEdgeBlank,
  flipImage,
}
