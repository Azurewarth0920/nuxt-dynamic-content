<template>
  <div>
    <h1>article template</h1>
    <p id="locals">article: {{ content.locals }}</p>
    <p id="matches">matched: {{ content.matches }}</p>
    <p id="siblings">siblings: {{ content.siblings }}</p>
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
