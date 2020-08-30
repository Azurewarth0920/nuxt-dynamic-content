function sortByQueries(content, sorters) {
  return content.reduce((acc, cur, idx) => {
    let localQuery

    if (typeof sorters === 'function') {
      localQuery = sorters(cur, idx)
    } else if (
      Array.isArray(sorters) &&
      sorters.filter(s => typeof s === 'function').length === sorters.length
    ) {
      localQuery = sorters.map(s => s(cur, idx))
    } else {
      throw new Error(
        'The sorters list should be either function or array of functions.'
      )
    }

    const key = localQuery.toString()

    if (key in acc) {
      acc[key].items = [...acc[key].items, cur]
    } else {
      acc[key] = {
        sorters: localQuery,
        items: [cur]
      }
    }

    return acc
  }, {})
}

module.exports = function(content, sorters, { path, component, resource }) {
  let guardedContent

  try {
    guardedContent = Array.isArray(content) ? content : Array.from(content)
  } catch (e) {
    throw new Error('The resource should be an Array or Array like object')
  }

  if (!path) {
    throw new Error('Path pattern needs to be specified')
  }

  if (!component) {
    throw new Error('Page component needs to be specified')
  }

  const sortedContent = sortByQueries(guardedContent, sorters)

  const sortersList = Object.keys(sortedContent).map(key => sortedContent[key])

  const preContent = sortersList.map(item => {
    const siblings = sortersList
      .filter(
        sortersItem =>
          JSON.stringify(sortersItem.sorters) !== JSON.stringify(item.sorters)
      )
      .map(siblingItem => siblingItem.items)
      .reduce((acc, val) => acc.concat(val), [])

    const guardedResource = resource && resource(item.sorters)

    return {
      path: path(item.sorters),
      component,
      matches: item.items,
      locals: item.sorters,
      siblings,
      resource: guardedResource
    }
  })

  if (resource && resource.constructor.name === 'AsyncFunction') {
    return Promise.all(
      preContent.map(async item => {
        const resolvedResource = await item.resource
        return {
          ...item,
          resource: resolvedResource
        }
      })
    )
  } else {
    return preContent
  }
}
