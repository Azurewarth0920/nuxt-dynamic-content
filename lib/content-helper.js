export class Content {
  constructor(resource) {
    this.content
    this.querys = []

    try {
      if (Array.isArray(resource)) {
        content = resource
      } else {
        content = Array.from(resource)
      }
    } catch {
      new Error('The resource should be an Array or Array like object')
    }
  }

  field(query) {
    if (query.constructor === 'function')
      this.content = []
    if (query.constructor === 'array')
      this.content = []

    new Error('The field list should be wheather function or array of functions')
  }
}
