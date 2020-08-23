const dynamicContent = require('../../lib/module')
const config = require('./module/dynamic-content.config')

module.exports = {
  modules: [[dynamicContent, config]],
  generate: {
    dir: './test/dist'
  }
}
