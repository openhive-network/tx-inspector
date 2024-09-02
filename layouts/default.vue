<template>
  <v-app class="dark app-bg">
    <v-main class="flex justify-center items-center">
      <NuxtPage />
      <Toaster close-button rich-colors :duration="5000" theme="dark" />
    </v-main>
    <Footer />
  </v-app>
</template>

<script lang="ts" setup>
import { Toaster } from '~/components/shadcn/sonner';
import Footer from '~/components/ui/Footer.vue';
</script>

<style scoped>
.app-bg {
  background-color: #000;
}
</style>
