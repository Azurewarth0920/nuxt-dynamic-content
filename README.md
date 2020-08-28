# Introduction

Empower your Nuxt.js application to generating dynamic route in full static mode with simple configuration.

## Installation

Use yarn

```bash
yarn add nuxt-dynamic-content
```

or npm

```bash
npm install nuxt-dynamic-content
```

Then, add `nuxt-dynamic-content` to the `modules` section of `nuxt.config.js`:

```JavaScript
import dynamicContent from 'nuxt-dynamic-content'

{
  modules: [
    dynamicContent
  ]
}
```

and don't forget to put config file `content.config.js` in `module` folder, or you can import your config into module section.

```JavaScript
import dynamicContent from 'nuxt-dynamic-content'
import dynamicContentConfig from '~/some-folder/'

{
  modules: [
    [dynamicContent, dynamicContentConfig]
  ]
}
```