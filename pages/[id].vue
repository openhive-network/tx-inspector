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
      <div v-if="store.$state.processedTransaction.transactionId !== ''">
        <s-skeleton v-if="store.$state.isLoading" class="w-[150px] h-[50px] skeleton" />
        <div v-else>
          <v-chip
            v-if="store.$state.processedTransaction.isValid"
            class="text-green custom-rounded-chip"
            variant="outlined"
            size="large"
            append-icon="mdi-check"
          >
            Transaction valid
          </v-chip>
          <v-chip
            v-else
            class="text-red custom-rounded-chip"
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
import type { ApiTransaction, TTransactionRequiredAuthorities } from '@hiveio/wax';
import { toast } from 'vue-sonner';
import TrxDialog from '~/components/ui/TrxDialog.vue';
import EndpointUrl from '~/components/ui/EndpointUrl.vue';
import AuthorityPathTable from '~/components/ui/AuthorityPathTable.vue';
import TrxTable from '~/components/ui/TrxTable.vue';
import AuthTable from '~/components/ui/AuthTable.vue';
import OperationsTable from '~/components/ui/OperationsTable.vue';
import ChainId from '~/components/ui/ChainId.vue';
import type { TProcessedTransaction } from '~/types/wax';

const store = useWaxStore();

const route = useRoute();
const { $chain, $txInspector } = useNuxtApp();

const useOperationsFormatter = (operations: any) => {
  const { $formatter } = useNuxtApp();

  return $formatter.format(operations);
};

onMounted(async () => {
  const id = route.params.id;

  store.$state.id = id as string;

  if (id) {
    store.$state.isLoading = false;

    try {
      store.$state.isLoading = true;

      let apiTrx!: ApiTransaction;
      let tx!: TProcessedTransaction;

      try {
        tx = await $txInspector.processTransactionId(id as string);
        apiTrx = tx.transaction.toApiJson();
      } catch {
        toast.error('Error', {
          description: 'Transaction not found'
        });
      }

      store.$state.processedTransaction = tx;

      const authoritiesForOperation: TTransactionRequiredAuthorities[] = [];
      for (let i = 0; i < store.$state.processedTransaction.operations.length; ++i) {
        const requiredAuthorityForOperation = await tx.requiredAuthoritiesForOperations(i);

        authoritiesForOperation.push(requiredAuthorityForOperation);
      }

      store.$state.authoritiesForOperation = authoritiesForOperation;
      store.$state.formattedOperations = useOperationsFormatter(tx.transaction.transaction).operations;

      const authorityPath = await getAuthorityPath($chain, apiTrx);

      if (authorityPath) {
        authorityPath.push(authorityPath.shift()!);
        store.$state.authorityPath = authorityPath;

        let totalWeight = 0;
        let totalThreshold = 0;

        for (let i = 0; i < authorityPath.length; ++i)
          if (authorityPath[i].authWeight) {
            totalWeight += authorityPath[i].authWeight!.auth;
            totalThreshold += authorityPath[i].authWeight!.weight;
          }

        if (totalWeight >= totalThreshold)
          store.$state.isSatisfied = true;
        else
          store.$state.isSatisfied = false;
      }
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Unknown error occured'
      });
    } finally {
      store.$state.isLoading = false;
    }
  }
});
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

.custom-rounded-chip {
  border-radius: 8px !important;
}
</style>
