export default ({ route }, inject) => {
  const rawVariable = <%= JSON.stringify(options.variables, null, 2) %>

  let dynamicContent = {}
  Object.defineProperty(dynamicContent, 'globals', {
    get: function() {
      return rawVariable.globals
    }
  })

  Object.defineProperty(dynamicContent, 'locals', {
    get: function() {
      return rawVariable[route.fullPath]
    }
  })

  inject('dynamicContent', dynamicContent)
}
