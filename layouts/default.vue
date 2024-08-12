<template>
  <v-app class="dark app-bg">
    <v-main class="flex justify-center items-center">
      <slot />
    </v-main>
  </v-app>
</template>

<style scoped>
.app-bg {
  background-color: #000;
}
</style>
