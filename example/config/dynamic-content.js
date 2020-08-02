const { resolve } = require("path");

module.exports = {
  routesList: [
    {
      path: '/detail/1',
      componentPath: resolve(__dirname, '../dynamic-template/detail.vue')
    },
    {
      path: '/detail/2',
      componentPath: resolve(__dirname, '../dynamic-template/detail.vue')
    },
    {
      path: '/year/2019',
      componentPath: resolve(__dirname, '../dynamic-template/year.vue')
    },
    {
      path: '/year/2020',
      componentPath: resolve(__dirname, '../dynamic-template/year.vue')
    },
    {
      path: '/category/news',
      componentPath: resolve(__dirname, '../dynamic-template/category.vue')
    },
    {
      path: '/category/entertainment',
      componentPath: resolve(__dirname, '../dynamic-template/category.vue')
    },
  ]
}