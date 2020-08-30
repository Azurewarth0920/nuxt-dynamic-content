const path = require('path')
const contentBuilder = require('./content-builder')

const loadConfig = async function(moduleOptionConfig, rootDir) {
  let config
  if (moduleOptionConfig.constructor.name.includes('Function')) {
    config = moduleOptionConfig
  } else {
    try {
      config = require(path.resolve(rootDir, './module/content.config.js'))
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        throw new Error(
          'Dynamic content config should be pass to module option or place to ~/module/content.config.js'
        )
      } else {
        throw e
      }
    }
  }

  const { modules, globals } =
    config.constructor.name === 'AsyncFunction' ? await config() : config()
  return { modules, globals }
}

const core = (module.exports = async function(config) {
  const variables = {}
  const { modules, globals } = await loadConfig(config, this.options.rootDir)

  Object.assign(variables, {
    globals
  })

  this.extendRoutes(routes => {
    modules
      .reduce((acc, val) => acc.concat(val), [])
      .forEach(routeItem => {
        const {
          locals,
          matches,
          siblings,
          path,
          component,
          resource,
          name
        } = routeItem

        const guardedPath = path.charAt(0) === '/' ? path : `/${path}`

        const routeConfig = {
          path: guardedPath,
          component,
          chunkName: guardedPath.replace('/', '')
        }

        Object.assign(variables, {
          [guardedPath]: {
            locals,
            matches,
            siblings
          }
        })

        if (resource) {
          variables[guardedPath].resource = resource
        }

        routeConfig.name = name
          ? name
          : (routeConfig.name = guardedPath
              .replace('/', '')
              .split('/')
              .join('-'))

        routes.push(routeConfig)
      })
  })

  this.addPlugin({
    src: path.resolve(__dirname, './context-injector.js'),
    options: {
      variables
    }
  })
})

core.contentBuilder = contentBuilder
