const { resolve } = require('path')
const { readFileSync } = require('fs')
const content = require('../../lib/module').contentBuilder

module.exports = function() {
  const { data } = JSON.parse(
    readFileSync(resolve(__dirname, '../dynamic-resources/list.json'))
  )

  const yearList = content(
    data,
    item => new Date(item.published_at).getFullYear(),
    {
      path: item => `/year/${item}`,
      component: '~/dynamic-template/year.vue'
    }
  )
  const categoryList = content(data, item => item.category, {
    path: category => `/category/${category}`,
    component: '~/dynamic-template/category.vue'
  })

  const detailList = content(data, item => item.id, {
    path: detailId => `/article/${detailId}`,
    component: '~/dynamic-template/article.vue',
    resource: detailId => {
      return JSON.parse(
        readFileSync(
          resolve(__dirname, `../dynamic-resources/feed_${detailId}.json`)
        )
      )
    }
  })

  const modules = [detailList, yearList, categoryList]
  return { modules, globals: data }
}
