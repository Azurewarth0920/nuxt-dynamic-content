const axios = require('axios')
const { resolve } = require('path')
const { readFileSync } = require('fs')
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

  const detailList = await content(data, item => item.id, {
    path: detailId => `/article/${detailId}`,
    component: './test/fixture/dynamic-template/article.vue',
    resource: async id => {
      const { data } = await axios.get(
        `http://localhost:3100/api/article/${id}`
      )
      return data
    }
  })

  const modules = [detailList, yearList, categoryList]
  return { modules, globals: data }
}
