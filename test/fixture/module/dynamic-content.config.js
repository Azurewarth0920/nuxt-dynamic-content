const axios = require('axios')
const { resolve } = require('path')
const { readFileSync, fstat } = require('fs')
const content = require('../../../lib/content-helper')

module.exports = async function() {
  const { data } = await axios.get('http://localhost:3100/api/list/')

  const yearList = content(
    data,
    item => new Date(item.createdAt).getFullYear(),
    {
      path: year => `/year/${year}`,
      component: './test/fixture/dynamic-template/year.vue'
    }
  )

  const categoryList = content(
    data,
    item => [item.mainCategory, item.subCategory],
    {
      path: category => `/category/${category[0]}/${category[1]}`,
      component: './test/fixture/dynamic-template/category.vue'
    }
  )

  const detailList = await content(data, item => [item.id, item.local], {
    path: item => `/article/${item[0]}`,
    component: './test/fixture/dynamic-template/article.vue',
    resource: async item => {
      if (item[1]) {
        const data = JSON.parse(
          readFileSync(resolve(__dirname, `../static/article-${item[0]}.json`))
        )

        return data
      } else {
        const { data } = await axios.get(
          `http://localhost:3100/api/article/${item[0]}`
        )
        return data
      }
    }
  })

  const modules = [detailList, yearList, categoryList]
  return { modules, globals: data }
}
