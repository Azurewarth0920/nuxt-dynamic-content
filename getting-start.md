# Getting start

after installing the module, config your dynamic route in your config files.

### 1. Import helper function into config.

```JavaScript
// helper
const contentBuilder = require('../../lib/module').contentBuilder

module.exports = function() {

......
```

### 2. Fetch content list from local or remote.

```JavaScript
// helper
const contentBuilder = require('../../lib/module').contentBuilder
const { resolve } = require('path')
const { readFileSync } = require('fs')

module.exports = function() {
  const { data } = JSON.parse(
    readFileSync(resolve(__dirname, '../content/articleList.json'))
  )
```

or you can use async/await in your config and export the async function.

```JavaScript
// helper
const contentBuilder = require('../../lib/module').contentBuilder
const axios = require('axios')

module.exports = async function() {
  const { data } = await axios.get('https://some-remote-resource/article')

```

### 3. After getting resource, use helper function to build module.

```JavaScript
......

const { data } = axios.get('https://some-remote-resource/article')

const yearModule = contentBuilder(
  data,
  item => new Date(item.createdAt).getFullYear(),
  {
    path: locals => `/year/${locals}`,
    component: '~/dynamic-template/year.vue'
  }
)

......
```

The content builder receive three arguments.

* `data` - Array, required

  The list of resource of content. the interface below is recommend.
  ```JSON
  [
    {
      "id": 1,
      "title": "the title of article-1",
      "content": "the content of article-1",
      "createdAt": "2020-08-28T02:55:54.131Z"
    },
    {
      "id": 2,
      "title": "the title of article-2",
    .......
  ]
  ```

* `sorter` - Array | Function, required

  The sorter can be either a function of array of functions, use to sort the resource and extract the locals.

  eg. Function
  ```JavaScript
    item => new Date(item.createdAt).getFullYear()
  ```

  The resource list will be group by the return value of the function (year). 

  eg. Array of functions
  ```JavaScript
    [
      item => new Date(item.createdAt).getFullYear(),
      item => new Date(item.createdAt).getMonth()
    ]
  ```

  The resource list will be group by the return value of the array of functions (year and month). 

* `config` - Object | required

  The config of path, component, resource for the grouped data.

  eg.
  ```JavaScript
  {
    // required
    path: locals => `/year/${locals}`,
    // required
    component: '~/template/year.vue'
  } 
  ```

  1. path
    The path pattern of grouped Data, if a function is passed to sorter, the locals will be a value, or if a array is passed to sorter, the locals will be the array.

    eg. Function
    ```JavaScript
    {
      path: locals => `/year/${locals}`,
      component: '~/template/year.vue'
    } 
    ```

    eg. Array of functions 
    ```JavaScript
    {
      path: locals => `/date/${locals[0]}/${locals[1]}`,
      component: '~/template/date.vue'
    } 
    ```

  2. component
    the page component of the grouped Data

  3. resource(optional)
    you can fetch extra resource from here, this is especially useful when the detail resource is integrated in another api which is not provided in the resource list.

    eg. normal function
    ```JavaScript
      {
        path: locals => `/year/${locals}`,
        component: '~/template/year.vue',
        resource: locals => {
          return JSON.parse(
            readFileSync(
              resolve(__dirname, `../dynamic-resources/year/detail/year-${locals}.json`)
            )
          )
        }
      }
    ```
    the `year-${year}.json` will be fetched to resource.

    or you can use async function to fetch external resource.

    ```JavaScript
      {
        path: locals => `/year/${locals}`,
        component: '~/template/year.vue',
        resource: async locals => {
          const { data } = await axios.get(`https://some-api/year/detail/year-${locals}.json`)
          return data
        }
      }
    ```

