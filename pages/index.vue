<template>
  <s-card class="w-4/5 card">
    <s-card-header class="flex flex-col md:flex-row justify-between items-center">
      <div class="flex items-center mb-4 md:mb-0">
        <img src="../assets/images/hive-logo.webp" alt="hive-logo" width="70px">
        <div class="ml-3">
          <s-card-title>
            Information about your transaction
          </s-card-title>
          <s-card-description class="mt-2">
            Check in easy and fast way all information about your transaction.
          </s-card-description>
        </div>
      </div>
      <EndpointUrl />
      <TrxDialog />
    </s-card-header>
    <s-card-content>
      <AuthorityPath />
    </s-card-content>
  </s-card>
</template>

<script lang="ts" setup>
import TrxDialog from '~/components/ui/TrxDialog.vue';
import EndpointUrl from '~/components/ui/EndpointUrl.vue';
import AuthorityPath from '~/components/ui/AuthorityPath.vue';
</script>

<style scoped>
.card {
  height: 95%;
  background-color: #000;
  border-color: rgb(63 63 70) !important;
  padding: 2rem;
}
</style>
