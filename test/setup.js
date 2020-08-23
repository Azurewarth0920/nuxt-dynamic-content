const spawn = require('child_process').spawn
const { setupMock, shutdownMock } = require('./mock')
const { loadConfig, generate } = require('@nuxtjs/module-test-utils')

async function build() {
  // clear
  spawn('rm', ['-rf', './test/dist'])

  // start mock
  setupMock()

  // nuxt generate
  const { generator } = await generate(loadConfig(__dirname))
  await generator.generate()

  // shutdown mock
  shutdownMock()
}

module.exports = build
