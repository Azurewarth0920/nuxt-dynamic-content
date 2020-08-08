export class Content {
  constructor(resource) {
    this.content
    this.querys

    try {
      content = Array.isArray(resource)
        ? recource
        : Array.from(resource)
    } catch {
      new Error('The resource should be an Array or Array like object')
    }
  }

  field(querys) {
    this.sortedField = this.content.reduce((cur, acc) => {
      let key, queries

      if (this.querys.constructor === 'function') {
        key = queries = this.querys(cur)
      } else if (this.querys.constructor === 'array') {
        queries = this.querys(q => q(cur))
        key = queries.toString()
      } else {
        new Error('The field list should be wheather function or array of functions')
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
}
