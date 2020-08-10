const { resolve } = require('path')
const { readFileSync } = require('fs')
const contentBuilder = require('../../lib/content-helper')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = async function() {
  const { data } = JSON.parse(
    readFileSync(resolve(__dirname, '../dynamic-resources/list.json'))
  )

  const yearList = contentBuilder(data, item => new Date(item.published_at), {
    path: item => `/date/${item}`,
    component: '~/dynamic-template/year.vue'
  })

  const categoryList = contentBuilder(data, item => item.category, {
    path: category => `/category/${category}`,
    component: '~/dynamic-template/category.vue'
  })

  const detailList = await contentBuilder(data, item => item.id, {
    path: detailId => `/detail/${detailId}`,
    component: '~/dynamic-template/detail.vue',
    resource: async detailId => {
      await sleep(1000)
      return readFileSync(
        resolve(__dirname, `../dynamic-resources/feed_${detailId}.json`)
      )
    }
  })

  const modules = [detailList, yearList, categoryList]

  return { modules, globals: data }
}
