export default ({ route }, inject) => {
  const rawVariable = <%= JSON.stringify(options.variables, null, 2) %>
  const dynamicContent = {}

  Object.defineProperty(dynamicContent, 'globals', {
    get() {
      return rawVariable.globals
    }
  })

  Object.defineProperty(dynamicContent, 'locals', {
    get() {
      return rawVariable[route.fullPath]
    }
  })

  inject('dynamicContent', dynamicContent)
}
