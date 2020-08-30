const { resolve } = require('path')
const { readFileSync } = require('fs')
const contentBuilder = require('../../lib/module').contentBuilder

module.exports = function() {
  const { data } = JSON.parse(
    readFileSync(resolve(__dirname, '../resources/list.json'))
  )

  const yearList = contentBuilder(
    data,
    item => new Date(item.published_at).getFullYear(),
    {
      path: year => `/year/${year}`,
      component: '~/templates/year.vue'
    }
  )
  const categoryList = contentBuilder(data, item => item.category, {
    path: category => `/category/${category}`,
    component: '~/templates/category.vue'
  })

  const detailList = contentBuilder(data, item => item.id, {
    path: detailId => `/article/${detailId}`,
    component: '~/templates/article.vue',
    resource: detailId => {
      return JSON.parse(
        readFileSync(resolve(__dirname, `../resources/feed_${detailId}.json`))
      )
    }
  })

  const modules = [detailList, yearList, categoryList]
  return { modules, globals: data }
}
