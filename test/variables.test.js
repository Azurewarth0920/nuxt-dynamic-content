const express = require('express')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

let server, browser, page

const pathBuilder = (localGetters, pattern) =>
  Array.from(
    new Set(
      db.list.map(articleItem =>
        Array.isArray(localGetters)
          ? JSON.stringify(
              localGetters.map(localItem => localItem(articleItem))
            )
          : localGetters(articleItem)
      )
    )
  ).map(item => ({
    localGetters,
    locals: Array.isArray(localGetters) ? JSON.parse(item) : item,
    path: pattern(Array.isArray(localGetters) ? JSON.parse(item) : item)
  }))

// raw content
const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'mock/db.json')))
const article4 = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'fixture/static/article-4.json'))
)

const articlePaths = pathBuilder(
  [item => item.id, item => item.local],
  locals => `article/${locals[0]}`
)

const categoryPaths = pathBuilder(
  [item => item.mainCategory, item => item.subCategory],
  locals => `category/${locals[0]}/${locals[1]}`
)
const yearPaths = pathBuilder(
  item => new Date(item.createdAt).getFullYear(),
  locals => `year/${locals}`
)

beforeAll(async () => {
  // browser
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  })

  page = await browser.newPage()

  // server
  const app = express()
  app.use(express.static('test/dist'))
  server = app.listen(3000)
})

afterAll(async () => {
  server && server.close()
  browser && (await browser.close())
})

describe('variables', () => {
  articlePaths.forEach(articleItem => {
    test('variables injected into article pages', () => testRunner(articleItem))
  })

  categoryPaths.forEach(categoryItem => {
    test('variables in category pages', () => testRunner(categoryItem))
  })

  yearPaths.forEach(yearItem => {
    test('variables in year pages', () => testRunner(yearItem))
  })
})

const testRunner = async route => {
  await page.goto(`http://localhost:3000/${route.path}`)
  const { locals, localGetters } = route

  // globals
  expect(
    await page.evaluate(() => window.$nuxt.$dynamicContent.globals)
  ).toEqual(db.list)

  // locals
  expect(
    await page.evaluate(() => window.$nuxt.$dynamicContent.locals)
  ).toEqual(locals)

  // matches
  const matches = db.list.filter(item =>
    Array.isArray(localGetters)
      ? JSON.stringify(localGetters.map(localGetter => localGetter(item))) ===
        JSON.stringify(locals)
      : localGetters(item) === locals
  )

  expect(
    await page.evaluate(() => window.$nuxt.$dynamicContent.matches)
  ).toEqual(matches)

  // siblings
  const siblings = db.list.filter(item =>
    Array.isArray(localGetters)
      ? JSON.stringify(localGetters.map(localGetter => localGetter(item))) !==
        JSON.stringify(locals)
      : localGetters(item) !== locals
  )

  expect(
    await page.evaluate(() => window.$nuxt.$dynamicContent.siblings)
  ).toEqual(siblings)
}
