<template>
  <h1>hello world</h1>
</template>

<script>
export default {
  mounted() {
    console.log(this.$dynamicContent.globals)
  }
}
</script>

<style lang="scss" scoped></style>
