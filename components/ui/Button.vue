<template>
  <s-button class="button">
    <slot />
  </s-button>
</template>

<style scoped>
.button {
  background-color: #D00023 !important;
  transition: opacity .2s;
}

.button:hover {
  opacity: 0.8;
}
</style>
