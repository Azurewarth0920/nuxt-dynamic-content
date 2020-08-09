function sortByField(content, querys) {
  return this.content.reduce((cur, acc) => {
    let key, queries

    if (this.querys.constructor === 'function') {
      key = queries = this.querys(cur)
    } else if (this.querys.constructor === 'array') {
      queries = this.querys(q => q(cur))
      key = queries.toString()
    } else {
      throw new Error(
        'The field list should be wheather function or array of functions'
      )
    }

    if (key in acc) {
      acc[key].items = [...acc[key].items, cur]
    } else {
      acc[key] = {
        queries: key,
        items: [cur]
      }
    }
  }, {})
}

export default async function(content, field, { path, component, resource }) {
  let guardedContent

  try {
    guardedContent = Array.isArray(content) ? content : Array.from(content)
  } catch (e) {
    throw new Error('The resource should be an Array or Array like object')
  }

  const sortedContent = sortByField(guardedContent, field)

  if (!path) {
    throw new Error('Path pattern needs to be specified')
  }

  if (!component) {
    throw new Error('Page component needs to be specified')
  }

  const fieldsList = Object.keys(sortedContent).map(key => sortedContent[key])

  return await fieldsList.map(async item => {
    const siblings = fieldsList.filter(
      fieldItem =>
        JSON.stringify(fieldItem.queries) !== JSON.stringify(item.queries)
    )

    const resolvedResource = resource && (await resource(item.queries))

    return {
      path: path(item.queries),
      component,
      chosens: item.items,
      locals: item.queries,
      siblings,
      resource: resolvedResource
    }
  })
}
