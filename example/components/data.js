// 获取SKU list
export function getSKUlist(product) {
  const typeKeys = product.options.map((key) => {
    const arr = key.split(/[\:\?]/)
    return arr[0] ? arr[0] : ''
  })
  const list = []
  for (const variant of product.variants) {
    const { price, options, id, sku } = variant

    const obj = {
      price,
      id,
      sku,
      options: {},
    }

    for (let i = 0; i < typeKeys.length; i++) {
      const key = typeKeys[i]
      obj.options[key] = options[i]
    }

    list.push(obj)
  }
  return list
}

// 置顶当前身体
export function topBodyCard(data) {
  for (const group of data.list) {
    for (const item of group.images) {
      if (String(item.id) === String(getTagID())) {
        data.list[0].images.unshift(item)
        return
      }
    }
  }
}

// 获取当前TagID
function getTagID() {
  const tags = '{{ product.tags | join:\',\' }}'
  const optionResult = tags.match(/mini-me-default-\d+/)
  const _number = optionResult && Number(optionResult[0].split('-').pop())
  return isNaN(_number) ? '' : _number
}

// ==========================================
// ==================提交数据=================
// ==========================================
// 执行时间计时器
class Timer {
  constructor() {
    this.records = new Map()
  }

  set(name) {
    const startDate = Date.now()
    this.records.set(name, startDate)
  }

  get(name) {
    const startDate = this.records.get(name)
    const interval = Date.now() - startDate
    return interval
  }
}

const timer = new Timer()

// 拉取当前站所有的配置
/* global $ */
export function fetchData(PLUGIN_TYPE, WEBSITE) {
  const fetchConfig = (type) => {
    let url
    if (type === 'current')
      url = `https://sback.globalhot.shop/plugins/api/v1/configure?webSite=${WEBSITE}&plugType=${PLUGIN_TYPE}`

    else if (type === 'public')
      url = 'https://sback.globalhot.shop/plugins/api/v1/configure?id=40'

    return new Promise((resolve, reject) => {
      $.ajax(url, {
        success(res) {
          const { status, data } = res
          if (status === '0' && data[0])
            resolve(data[0])

          else
            reject(new Error('配置错误'))
        },
        error: () => {
          reject(new Error('拉取失败'))
        },
      })
    })
  }
  timer.set('fetch')
  return Promise.all([fetchConfig('public'), fetchConfig('current')]).then(([data1, data2]) => {
    console.log(`数据请求耗时：${timer.get('fetch') / 1000}秒`)
    data1.configure = JSON.parse(data1.configure)
    data2.configure = JSON.parse(data2.configure)
    data2.configure.miniMeData = data1.configure.miniMeData
    data2.configure.composingList = data1.configure.composingList
    data2.configure.backgroundList = data1.configure.backgroundList
    data2.configure.sizeList = data1.configure.sizeList
    data2.configure = JSON.stringify(data2.configure)
    return data2
  })
}

// 获取产品对应的配置
export function getProductConfig(configData, productType) {
  timer.set('deal')
  const config = createSubmitData(configData, productType)
  console.log(`数据处理完成，耗时：${timer.get('deal') / 1000}秒`)
  return config
}

// ==========================================
// ==================提交数据=================
// ==========================================
let backgroundList = []
let bodyList = []
let bodyMap
let bodyLanguageMap
let backgroundMap
let backgroundLanguageMap
let composingMap
let relatedProductMap
let sizeMap

function createSubmitData(data, productType) {
  data.configure = JSON.parse(data.configure)
  backgroundList = data.configure.backgroundList || []
  bodyList = data.configure.miniMeData || []
  bodyMap = createBodyMap(data.configure.miniMeData || [])
  bodyLanguageMap = createBodyLanguageMap(data.configure.miniMeData || [])
  composingMap = createComposingMap(data.configure.composingList || [])
  backgroundMap = createBackgroundMap()
  backgroundLanguageMap = createBackgroundLanguageMap()
  relatedProductMap = createRelatedProductMap(data.configure.relatedProductsList || [])
  sizeMap = createSizeMap(data.configure.sizeList || [])
  // 循环解析商品分类
  const productTypeData = data.configure.productTypeConfigList.find(item => item.type.trim() === productType.trim())
  dealSubmitBody(productTypeData.body)
  dealSubmitdBackground(productTypeData.background)
  dealSubmitRelatedProduct(productTypeData.relatedProduct)
  dealSubmitNightLight(productTypeData.nightLight)
  // 删除不必要的字段
  return productTypeData
}

// 身体
function dealSubmitBody(body) {
  timer.set('body')
  const bodyCardList = body.list.map(bodyMap).filter(item => item)
  console.log(`处理身体需要用时：${timer.get('body') / 1000}s`)
  body.list = createBodyGroupList(bodyCardList)
}

function createBodyGroupList(list) {
  const groupList = bodyList.map(item => ({
    name: item.name,
    id: item.id,
    language: bodyLanguageMap(item.id),
    images: [],
  }))
  for (const item of list) {
    for (const group of groupList) {
      if (item.pid === group.id)
        group.images.push(item)
    }
  }
  const res = groupList.filter(group => group.images.length > 0)
  return res
}

// 背景
function dealSubmitdBackground(background) {
  background.data = createBackgroundGroupList(background.data.map(backgroundMap).filter(item => item))
  background.size = background.size.map(sizeMap)
}

function createBackgroundGroupList(list) {
  const groupList = backgroundList.map(item => ({
    title: item.title,
    id: item.id,
    language: backgroundLanguageMap(item.id),
    children: [],
  }))
  for (const item of list) {
    for (const group of groupList) {
      if (item.pid === group.id)
        group.children.push(item)
    }
  }
  return groupList.filter(group => group.children.length > 0)
}

// 尺寸
function createSizeMap(sizeList) {
  const map = new Map()
  for (let i = 0; i < sizeList.length; i++) {
    const item = JSON.parse(JSON.stringify(sizeList[i]))
    map.set(item.label, item)
  }
  return function getSize(label) {
    return map.get(label)
  }
}

// 提交数据-关联商品
function dealSubmitRelatedProduct(product) {
  product.data = product.data.map(relatedProductMap)
}

// 夜灯
function dealSubmitNightLight(nightLight) {
  if (nightLight && nightLight.data) {
    nightLight.data = nightLight.data.map((item) => {
      return {
        ...item,
        background: backgroundMap(item.backgroundID),
        size: sizeMap(item.size),
      }
    })
  }
}
/**
 * ===================== MAP ===================
 */
// 生成身体map
function createBodyMap() {
  const map = new Map()
  for (let i = 0; i < bodyList.length; i++) {
    const group = bodyList[i]
    for (let j = 0; j < group.images.length; j++) {
      const item = group.images[j]
      map.set(item.index, {
        ...item,
        pid: group.id,
      })
    }
  }
  return function getBody(index) {
    return map.get(index)
  }
}

function createBodyLanguageMap() {
  const map = new Map()
  for (let i = 0; i < bodyList.length; i++) {
    const group = bodyList[i]
    map.set(group.id, group.language)
  }
  return function getBodyLanguage(index) {
    return map.get(index)
  }
}

// 排版
function createComposingMap(composingList) {
  const map = new Map()
  for (let i = 0; i < composingList.length; i++) {
    const item = composingList[i]
    map.set(item.id, item)
  }
  return function getComposing(id) {
    return map.get(id)
  }
}

// 生成背景map
function createBackgroundMap() {
  const map = new Map()
  for (let i = 0; i < backgroundList.length; i++) {
    const group = backgroundList[i]
    for (let j = 0; j < group.children.length; j++) {
      const item = JSON.parse(JSON.stringify(group.children[j]))
      item.composing = composingMap(item.composing)
      map.set(item.title, {
        ...item,
        pid: group.id,
      })
    }
  }
  return function getBackground(name) {
    return map.get(name)
  }
}

function createBackgroundLanguageMap() {
  const map = new Map()
  for (let i = 0; i < backgroundList.length; i++) {
    const group = backgroundList[i]
    map.set(group.id, group.language)
  }
  return function getBackgroundLanguage(name) {
    return map.get(name)
  }
}

// 关联产品
function createRelatedProductMap(relatedProductsList) {
  const map = new Map()
  for (let i = 0; i < relatedProductsList.length; i++) {
    const item = relatedProductsList[i]
    map.set(item.uid, item)
  }
  return function getRelatedProduct(uid) {
    return map.get(uid)
  }
}
