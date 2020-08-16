function toggleTrailingSlashes(url) {
  return url.charAt(url.length - 1) === '/'
    ? url.slice(0, url.length - 1)
    : `${url}/`
}

export default ({ route }, inject) => {
  const rawVariable = <%= JSON.stringify(options.variables, null, 2) %>
  const dynamicContent = {}

  console.log(rawVariable.globals)

  if (rawVariable.globals) {
    Object.defineProperty(dynamicContent, 'globals', {
      get() {
        return rawVariable.globals
      }
    })
  }

  const matchedVariables = rawVariable[route.fullPath] || rawVariable[toggleTrailingSlashes(route.fullPath)]

  if (matchedVariables) {
    Object.keys(matchedVariables).forEach(key => {
      if (matchedVariables[key]) {
        Object.defineProperty(dynamicContent, key, {
          get() {
            return matchedVariables[key]
          }
        })
      }
    })
  }
  

  inject('dynamicContent', dynamicContent)
}
