<template>
  <div>year: {{ $dynamicContent.locals }}</div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$dynamicContent)
  }
}
</script>

<style scoped></style>
