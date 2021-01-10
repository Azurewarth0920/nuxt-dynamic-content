function normalize(url) {
  return url.charAt(url.length - 1) === '/'
    ? url.slice(0, url.length - 1)
    : `${url}/`
}

export default ({ route }, inject) => {
  const rawVariable = <%= JSON.stringify(options.variables, null, 2) %>
  const dynamicContent = {}

  if (rawVariable.globals) {
    Object.defineProperty(dynamicContent, 'globals', {
      get() {
        return rawVariable.globals
      }
    })
  }

  const matchedVariables = rawVariable[route.fullPath] || rawVariable[normalize(route.fullPath)]

  if (matchedVariables) {
    Object.keys(matchedVariables).forEach(key => {
      if (matchedVariables[key]) {
        Object.defineProperty(dynamicContent, key, {
          get() {
            return {
              matchedVariables[key],
              siblings: () => {
                const currentDataMap = rawVariable.dataMap[matchedVariables[key].dataIdentifer]
                return Object.keys(currentDataMap)
                  .filter(pathItem => pathItem !== JSON.stringify(matchedVariables[key].locals))
                  .reduce((acc, cur) => { acc.push(...currentDataMap[cur]) }, [])
              }
            }
          }
        })
      }
    })
  }
  

  inject('dynamicContent', dynamicContent)
}
