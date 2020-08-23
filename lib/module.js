const path = require('path')

const loadConfig = async function(moduleOptionConfig, rootDir) {
  let config
  if (moduleOptionConfig.constructor.name.includes('Function')) {
    config = moduleOptionConfig
  } else {
    try {
      config = require(path.resolve(
        rootDir,
        './module/dynamic-content.config.js'
      ))
    } catch (e) {
      throw new Error(
        'Dynamic content config should be pass to module option or place to ~/module/dynamic-content.config.js'
      )
    }
  }

  const { modules, globals } =
    config.constructor.name === 'AsyncFunction' ? await config() : config()
  return { modules, globals }
}

module.exports = async function(config) {
  const variables = {}
  const { modules, globals } = await loadConfig(config, this.options.rootDir)

  Object.assign(variables, {
    globals
  })

  this.extendRoutes(routes => {
    modules
      .reduce((acc, val) => acc.concat(val), [])
      .forEach(routeItem => {
        const routeConfig = {
          path: routeItem.path,
          component: routeItem.component,
          chunkName: routeItem.path.replace('/', '')
        }

        const { locals, matches, siblings } = routeItem

        Object.assign(variables, {
          [routeItem.path]: {
            locals,
            matches,
            siblings
          }
        })

        if (routeItem.resource) {
          Object.assign(variables, {
            [routeItem.path]: {
              resource: routeItem.resource
            }
          })
        }

        routeConfig.name = routeItem.name
          ? routeItem.name
          : (routeConfig.name = routeItem.path
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
}
