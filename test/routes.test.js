const fs = require('fs')
const path = require('path')

describe('routes', () => {
  const paths = [
    'article/1/index.html',
    'article/2/index.html',
    'article/3/index.html',
    'article/4/index.html',
    'category/main-type-a/sub-type-a/index.html',
    'category/main-type-b/sub-type-c/index.html',
    'category/main-type-b/sub-type-d/index.html',
    'year/2019/index.html',
    'year/2020/index.html'
  ]

  paths.forEach(pathItem => {
    test(`${pathItem} is generated`, () => {
      const resolvedPath = path.resolve(__dirname, 'dist', pathItem)
      expect(fs.existsSync(resolvedPath)).toBe(true)
    })
  })
})
