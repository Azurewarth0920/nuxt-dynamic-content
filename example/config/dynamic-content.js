const { resolve } = require("path");
const { readFileSync } = require("fs");

module.exports = async function() {
  const { data } = JSON.parse(readFileSync(resolve(__dirname, '../dynamic-resources/list.json')))

  const yearList = Array.from(new Set(data.map(item => new Date(item.published_at).getFullYear())))
    .map(yearItem => ({
      path: `/year/${yearItem}`,
      componentPath: resolve(__dirname, '../dynamic-template/year.vue'),
      locals: yearItem
    }))
  
  const categoryList = Array.from(new Set(data.map(item => item.category)))
    .map(categoryItem => ({
      path: `/category/${categoryItem}`,
      componentPath: resolve(__dirname, '../dynamic-template/category.vue'),
      locals: categoryItem
    }))
  
  const detailList = Array.from(new Set(data.map(item => item.id)))
    .map(detailId => ({
      path: `/detail/${detailId}`,
      componentPath: resolve(__dirname, '../dynamic-template/detail.vue'),
      locals: JSON.parse(readFileSync(resolve(__dirname, `../dynamic-resources/feed_${detailId}.json`)))
    }))

  const routesList = [
    ...detailList,
    ...yearList,
    ...categoryList
  ]

  return { routesList, globals: data }
}