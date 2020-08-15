const { resolve } = require('path')
const { readFileSync } = require('fs')
const contentBuilder = require('../../lib/content-helper')

module.exports = async function() {
  const { data } = JSON.parse(
    readFileSync(resolve(__dirname, '../dynamic-resources/list.json'))
  )
  const yearList = contentBuilder(
    data,
    item => new Date(item.published_at).getFullYear(),
    {
      path: item => `/year/${item}`,
      component: '~/dynamic-template/year.vue'
    }
  )
  const categoryList = contentBuilder(data, item => item.category, {
    path: category => `/category/${category}`,
    component: '~/dynamic-template/category.vue'
  })
  const detailList = await contentBuilder(data, item => item.id, {
    path: detailId => `/detail/${detailId}`,
    component: '~/dynamic-template/detail.vue',
    resource: detailId => {
      return readFileSync(
        resolve(__dirname, `../dynamic-resources/feed_${detailId}.json`)
      )
    }
  })
  const modules = [detailList, yearList, categoryList]
  return { modules, globals: data }
}
