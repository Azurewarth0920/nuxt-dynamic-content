const path = require('path')

module.exports = async function(moduleOptions) {
  const variables = {}
  const { modules, globals } = await moduleOptions()

  console.log(modules)

  Object.assign(variables, {
    globals
  })

  this.extendRoutes(routes => {
    modules.forEach(routeItem => {
      const routeConfig = {
        path: routeItem.path,
        component: routeItem.componentPath,
        chunkName: routeItem.path.replace('/', '')
      }

      Object.assign(variables, {
        [routeItem.path]: routeItem.locals
      })

      if (routeItem.name) {
        routeConfig.name = routeItem.name
      } else {
        routeConfig.name = routeItem.path
          .replace('/', '')
          .split('/')
          .join('-')
      }

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
