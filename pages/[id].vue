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
      <div v-if="store.$state.id.length !== 0">
        <s-skeleton v-if="store.$state.isLoading" class="w-[150px] h-[50px] skeleton" />
        <div v-else>
          <span v-if="store.$state.isValid" class="text-green">
            Transaction valid
            <v-icon class="ml-2 mb-2">
              mdi-check
            </v-icon>
          </span>
          <span v-else class="text-red">
            Transaction invalid
            <v-icon class="ml-2 mb-1">
              mdi-close
            </v-icon>
          </span>
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

const store = useWaxStore();

const route = useRoute();
const { $wax } = useNuxtApp();

const useOperationsFormatter = (operations: any) => {
  const { $formatter } = useNuxtApp();

  return $formatter.format(operations);
};

onMounted(async () => {
  const id = route.params.id;

  if (id) {
    store.$state.isLoading = false;

    try {
      store.$state.isLoading = true;

      let trx!: ApiTransaction;

      try {
        trx = await $wax.getTransactionFromId(id as string);
      } catch {
        toast.error('Error', {
          description: 'Transaction not found'
        });
      }

      const authorityPath = await getAuthorityPath($wax, trx);

      store.$state.signatures = $wax.getSignatures(trx);
      store.$state.pack = await $wax.getPackType(trx);
      store.$state.publicKeys = await $wax.getSignatureKeys(trx);
      store.$state.id = await $wax.getTransactionId(trx);
      store.$state.sigDigest = await $wax.getSigDigest(trx);
      store.$state.authorityType = await $wax.getAuthorityType(trx);
      store.$state.isValid = await $wax.checkVerifyAuthority(trx);
      store.$state.operations = await $wax.getOperationsFromTransaction(trx);
      store.$state.signeesByKeys = await $wax.findSigneesForKeys(store.$state.publicKeys);
      store.$state.formattedOperations = useOperationsFormatter(trx).operations;

      const authoritiesForOperation: TTransactionRequiredAuthorities[] = [];
      for (let i = 0; i < store.$state.operations.length; ++i) {
        const requiredAuthorityForOperation = await $wax.getRequiredAuthoritiesForOperation(trx, i);

        authoritiesForOperation.push(requiredAuthorityForOperation);
      }

      store.$state.requiredAuthoritiesForOperation = authoritiesForOperation;

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
</style>
