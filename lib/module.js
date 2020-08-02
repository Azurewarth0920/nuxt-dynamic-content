module.exports = async function (moduleOptions) {
  const { routesList, globals } = await moduleOptions()

  this.extendRoutes((routes) => {
    routesList.forEach(routeItem => {
      let routeConfig = {
        path: routeItem.path,
        component: routeItem.componentPath,
        chunkName: routeItem.path.replace('/', '')
      }

      if (routeItem.name) {
        routeConfig.name = routeItem.name
      } else {
        routeConfig.name = routeItem.path.replace('/', '').split('/').join('-')
      }

      routes.push(routeConfig)
    })
  })
}