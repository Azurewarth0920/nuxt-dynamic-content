<template>
  <div>
    <h1>category template</h1>
    <p id="locals-0">category: {{ content.locals[0] }}</p>
    <p id="locals-1">subCategory: {{ content.locals[1] }}</p>
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
