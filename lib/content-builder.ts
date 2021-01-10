function sortByQueries<T, U>(
  content: Array<T>,
  sorters: (arg: T, index?: number) => U
): Record<string, Array<T>> {
  if (typeof sorters !== 'function') {
    throw new Error('The sorter should be a function.')
  }

  return content.reduce((acc, cur, index) => {
    const localQuery = sorters(cur, index)

    const key = sorters(cur, index).toString()

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

interface DataOption<U, Q> {
  path?: (path: string) => string
  component?: string
  resource: (arg: U) => Promise<Q> | ((arg: U) => Q)
}

module.exports = function<T, U, Q>(
  data: any,
  sorters: (item: T, index?: number) => U,
  { path, component, resource }: DataOption<U, Q>
) {
  let guardedData: Array<T>

  try {
    guardedData = Array.isArray(data) ? data : Array.from(data)
  } catch (e) {
    throw new Error('The resource should be an Array or Array like object')
  }

  if (!path) {
    throw new Error('Path pattern needs to be specified')
  }

  if (!component) {
    throw new Error('Page component needs to be specified')
  }

  const sortedData = sortByQueries<T, U>(guardedData, sorters)

  const content = Object.keys(sortedData).map(item => {
    return {
      path: path(JSON.parse(item)),
      component,
      matches: sortedData[item],
      locals: JSON.parse(item) as U
    }
  })

  if (resource) {
    if (!resource.constructor.name.includes('Function')) {
      throw new Error('The resource should be a function.')
    }
    if (resource.constructor.name === 'Async') {
      const contentWithResource = Promise.all(
        content.map(async item => {
          const resolvedResource = await resource(item.locals)
          return {
            ...item,
            resource: resolvedResource
          }
        })
      )

      return {
        content: contentWithResource,
        map: sortedData,
        key: component
      }
    } else {
      return {
        content: content.map(item => ({
          ...item,
          resource: resource(item.locals)
        })),
        map: sortedData,
        key: component
      }
    }
  } else {
    return {
      content,
      map: sortedData,
      key: component
    }
  }
}
