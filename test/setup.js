const { setupMock, shutdownMock } = require('./mock')
const { loadConfig, generate } = require('@nuxtjs/module-test-utils')

async function build() {
  setupMock()
  const { generator } = await generate(loadConfig(__dirname))
  await generator.generate()
  shutdownMock()
}

module.exports = build
