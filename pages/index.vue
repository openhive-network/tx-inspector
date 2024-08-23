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
      <div v-if="store.$state.id.length !== 0">
        <s-skeleton v-if="store.$state.isLoading" class="w-[50px] h-[50px] skeleton" />
        <div v-else>
          <v-icon v-if="store.$state.isValid" color="green">
            mdi-check
          </v-icon>
          <v-icon v-else color="red">
            mdi-close
          </v-icon>
        </div>
      </div>
      <EndpointUrl />
      <TrxDialog />
    </s-card-header>
    <s-card-content>
      <AuthorityPathTable />
      <hr class="my-8">
      <div class="flex gap-4">
        <TrxTable class="w-1/2" />
        <AuthTable class="w-1/2" />
      </div>
      <hr class="my-8">
      <div>
        <Operations />
      </div>
    </s-card-content>
  </s-card>
</template>

<script lang="ts" setup>
import TrxDialog from '~/components/ui/TrxDialog.vue';
import EndpointUrl from '~/components/ui/EndpointUrl.vue';
import AuthorityPathTable from '~/components/ui/AuthorityPathTable.vue';
import TrxTable from '~/components/ui/TrxTable.vue';
import AuthTable from '~/components/ui/AuthTable.vue';
import Operations from '~/components/ui/Operations.vue';

const store = useWaxStore();
</script>

<style scoped>
.card {
  height: 95%;
  background-color: #000;
  border-color: #3f3f46 !important;
  padding: 2rem;
}

.skeleton {
  background: rgb(63 63 70);
}
</style>
