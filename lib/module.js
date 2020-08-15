const path = require('path')

module.exports = async function(moduleOptions) {
  const variables = {}
  const { modules, globals } = await moduleOptions()

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

        Object.assign(variables, {
          [routeItem.path]: {
            locals: routeItem.locals,
            matches: routeItem.matches,
            siblings: routeItem.siblings
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
