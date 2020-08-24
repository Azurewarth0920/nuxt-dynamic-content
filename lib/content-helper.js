function sortByQueries(content, queries) {
  return content.reduce((acc, cur) => {
    let localQuery

    if (typeof queries === 'function') {
      localQuery = queries(cur)
    } else if (
      Array.isArray(queries) &&
      queries.filter(q => typeof q === 'function').length === queries.length
    ) {
      localQuery = queries(q => q(cur))
    } else {
      throw new Error(
        'The queries list should be wheather function or array of functions'
      )
    }

    const key = localQuery.toString()

    if (key in acc) {
      acc[key].items = [...acc[key].items, cur]
    } else {
      acc[key] = {
        queries: localQuery,
        items: [cur]
      }
    }

    return acc
  }, {})
}

module.exports = function(content, queries, { path, component, resource }) {
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

  const sortedContent = sortByQueries(guardedContent, queries)

  const queriesList = Object.keys(sortedContent).map(key => sortedContent[key])

  const preContent = queriesList.map(item => {
    const siblings = queriesList
      .filter(
        queriesItem =>
          JSON.stringify(queriesItem.queries) !== JSON.stringify(item.queries)
      )
      .map(siblingItem => siblingItem.items)
      .reduce((acc, val) => acc.concat(val), [])

    const guardedResource = resource && resource(item.queries)

    return {
      path: path(item.queries),
      component,
      matches: item.items,
      locals: item.queries,
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
