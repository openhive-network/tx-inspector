<template>
  <v-app class="dark app-bg">
    <v-main class="flex justify-center items-center">
      <slot />
    </v-main>
    <Footer />
  </v-app>
</template>

<script lang="ts" setup>
import Footer from '~/components/ui/Footer.vue';
</script>

<style scoped>
.app-bg {
  background-color: #000;
}
</style>
