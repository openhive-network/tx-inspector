<template>
  <s-card class="w-4/5 card">
    <s-card-header class="flex flex-col md:flex-row justify-between items-center">
      <div class="flex items-center mb-4 md:mb-0">
        <img src="../assets/images/hive-logo.webp" alt="hive-logo" width="70px">
        <div class="ml-3">
          <s-card-title>
            Transaction Inspector
          </s-card-title>
          <s-card-description class="mt-2">
            Check in easy and fast way all information about your transaction.
          </s-card-description>
        </div>
      </div>
      <div v-if="store.processedTransaction.value.transactionId.length !== 0">
        <s-skeleton v-if="store.isLoading.value" class="w-[150px] h-[50px] skeleton" />
        <div v-else>
          <v-chip
            v-if="store.processedTransaction.value.isValid"
            class="text-green rounded-xl"
            variant="outlined"
            size="large"
            append-icon="mdi-check"
          >
            Transaction valid
          </v-chip>
          <v-chip
            v-else
            class="text-red rounded-xl"
            variant="outlined"
            size="large"
            append-icon="mdi-close"
          >
            Transaction invalid
          </v-chip>
        </div>
      </div>
      <EndpointUrl />
      <ChainId />
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
      <div class="mb-16">
        <OperationsTable />
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
import OperationsTable from '~/components/ui/OperationsTable.vue';
import ChainId from '~/components/ui/ChainId.vue';

const wax = useWaxStore();
const store = storeToRefs(wax);
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
