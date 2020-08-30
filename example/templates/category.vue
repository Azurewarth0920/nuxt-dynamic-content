<template>
  <div>
    <h1>Category template</h1>
    <h2>globals:</h2>
    <pre>{{ content.globals }}</pre>

    <h2>locals:</h2>
    <pre>{{ content.locals }}</pre>

    <h2>matches:</h2>
    <pre>{{ content.matches }}</pre>

    <h2>siblings:</h2>
    <pre>{{ content.siblings }}</pre>
  </div>
</template>

<script>
export default {
  computed: {
    content() {
      return this.$dynamicContent
    }
  }
}
</script>
