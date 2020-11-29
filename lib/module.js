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
  const dataMap = modules.reduce((acc, cur) => {
    acc[cur.key] = cur.map
  }, {})

  Object.assign(variables, {
    globals,
    dataMap
  })

  this.extendRoutes(routes => {
    modules
      .reduce((acc, cur) => acc.concat(cur), [])
      .forEach(routeItem => {
        const { locals, matches, path, component, resource, name } = routeItem

        const normalizedPath = path.charAt(0) === '/' ? path : `/${path}`

        const routeConfig = {
          path: normalizedPath,
          component,
          chunkName: normalizedPath.replace('/', '')
        }

        Object.assign(variables, {
          [normalizedPath]: {
            locals,
            matches,
            dataIdentifer: component
          }
        })

        if (resource) {
          variables[normalizedPath].resource = resource
        }

        routeConfig.name = name
          ? name
          : (routeConfig.name = normalizedPath
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
