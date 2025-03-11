<template>
  <s-card class="w-full md:w-4/5 card">
    <s-card-header class="flex flex-col xl:flex-row justify-between items-center">
      <div class="flex flex-col xl:flex-row items-center mb-4 md:mb-0">
        <img src="../assets/images/hive-logo.webp" alt="hive-logo" width="70px">
        <div class="ml-8 mt-3 xl:mt-0 text-center">
          <s-card-title class="text-xl">
            Transaction Inspector
          </s-card-title>
          <s-card-description class="mt-2">
            Check in easy and fast way all information about your transaction.
          </s-card-description>
        </div>
      </div>
      <div v-if="store.processedTransaction.value.transactionData.id !== ''" class="mx-auto">
        <s-skeleton v-if="store.isLoading.value" class="w-[150px] h-[50px] skeleton" />
        <div v-else>
          <v-chip
            v-if="store.processedTransaction.value.transactionOtherData.isValid"
            class="text-green custom-rounded-chip"
            variant="outlined"
            size="large"
            append-icon="mdi-check"
          >
            Processing status
          </v-chip>
          <v-chip
            v-else
            class="text-red custom-rounded-chip"
            variant="outlined"
            size="large"
            append-icon="mdi-close"
          >
            Processing status
          </v-chip>
        </div>
      </div>
      <TrxDialog />
    </s-card-header>
    <s-card-content>
      <AuthorityPathTable />
      <hr class="my-8">
      <div class="flex flex-col gap-4">
        <AuthTable class="w-full" />
        <hr class="my-3">
        <TrxTable class="w-full" />
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
import AuthorityPathTable from '~/components/ui/AuthorityPathTable.vue';
import TrxTable from '~/components/ui/TrxTable.vue';
import AuthTable from '~/components/ui/AuthTable.vue';
import OperationsTable from '~/components/ui/OperationsTable.vue';

const wax = useWaxStore();
const store = storeToRefs(wax);

const { $txInspector, $formatter } = useNuxtApp();

onMounted(async () => {
  let start!: number;
  let end!: number;
  let processingTime!: number;
  wax.$state.qs = new URLSearchParams(location.search);
  const qs = wax.$state.qs;
  if (qs.has('transaction')) {
    wax.$state.isLoading = true;
    start = Date.now();
  }
  try {
    await wax.handleTransactionFromHash($txInspector, $formatter, qs.get('transaction')!);
  } catch (_error) {
    try {
      await wax.handleTransactionFromJson($txInspector, $formatter, atob(qs.get('transaction')!));
    } catch (_error) {
      try {
        await wax.handleTransactionFromBinary($txInspector, $formatter, qs.get('transaction')!);
      } catch (_error) {}
    }
  } finally {
    wax.$state.isLoading = false;
    end = Date.now();

    processingTime = Number(((end - start) / 1000).toFixed(2));

    store.processingTime.value = processingTime;
  }
});
</script>

<style scoped>
.card {
  margin: 2rem 0;
  background-color: #000;
  border-color: #3f3f46 !important;
  padding: 2rem;
}

.skeleton {
  background: rgb(63 63 70);
}

.custom-rounded-chip {
  border-radius: 8px !important;
}
</style>
