/**
 * 对象取值
 * @param {Object | Array} form
 * @param  {...any} selectors
 * @returns
 */
export function getValue(form: any, ...selectors: string[]) {
  const res = selectors.map((s) => {
    return s
      .replace(/\[(\w+)\]/g, '.$1')
      .split('.')
      .reduce((prev, cur) => {
        return prev && prev[cur]
      }, form)
  })
  return res
}

/**
 * @description: 获取数组最后一个元素
 * @param {any:[]} arr
 * @return {*}
 */
export function getArrayLast(arr: any[]) {
  if (Array.isArray(arr)) {
    if (arr.length === 0) {
      return null
    }
    else {
      const len = arr.length
      return arr[len - 1]
    }
  }
  else {
    return null
  }
}

/**
 * @description: 随机ID
 * @param {*} length
 * @return {*}
 */
export function randomID(length = 8) {
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
}
