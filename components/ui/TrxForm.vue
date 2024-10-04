<template>
  <div class="flex flex-col" @keydown.enter="handleKeydown">
    <div class="my-2">
      <s-radio-group v-model="radioState" default-value="json" class="flex mb-3">
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="json" value="json" />
          <s-label for="json">
            JSON
          </s-label>
        </div>
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="hash" value="hash" />
          <s-label for="hash">
            Hash (ID)
          </s-label>
        </div>
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="binary" value="binary" disabled />
          <s-label for="binary">
            Binary
          </s-label>
        </div>
      </s-radio-group>
      <s-label>
        Transaction ({{ radioState }} format)
      </s-label>
      <s-input
        v-if="radioState === 'hash'"
        v-model="hash"
        placeholder="Provide your transaction hash"
        class="mt-3 mb-[14.5rem]"
        required
      />
      <s-textarea
        v-else
        v-model="trx"
        :placeholder="`Provide your transaction ${radioState}`"
        class="min-h-64 max-h-64 my-3"
        required
      />
    </div>
    <s-dialog-footer>
      <s-dialog-close as-child>
        <Button @click="submitTransaction()">
          Submit
        </Button>
      </s-dialog-close>
    </s-dialog-footer>
  </div>
</template>

<script lang="ts" setup>
import type { ApiTransaction, TTransactionRequiredAuthorities } from '@hiveio/wax';
import { toast } from 'vue-sonner';
import Button from '~/components/ui/Button.vue';

const store = useWaxStore();

const { $chain, $txInspector } = useNuxtApp();

const radioState = ref('json');

const trx = defineModel<string>('transaction');
const hash = defineModel<string>('hash');

const useOperationsFormatter = (operations: any) => {
  const { $formatter } = useNuxtApp();

  return $formatter.format(operations);
};

const submitTransaction = async () => {
  store.$state.isLoading = false;
  store.$state.authorityPath.length = 0;
  try {
    store.$state.isLoading = true;

    if (radioState.value === 'hash') {
      if (hash.value === undefined)
        throw new Error('Hash is required');

      const tx = await $txInspector.processTransactionId(hash.value);
      store.$state.processedTransaction = tx;
      store.$state.formattedOperations = useOperationsFormatter(tx.transaction.transaction).operations;
      (trx.value as unknown as ApiTransaction) = tx.transaction.toApiJson();
    } else if (radioState.value === 'json') {
      if (trx.value === undefined)
        throw new Error('Transaction is required');

      trx.value = JSON.parse(String(trx.value!.trim()));
      const tx = await $txInspector.processTransaction(trx.value as unknown as ApiTransaction);
      store.$state.processedTransaction = tx;
      store.$state.formattedOperations = useOperationsFormatter(tx.transaction.transaction).operations;
    } else
      throw new Error('Provide transaction in choosen format');

    const authoritiesForOperation: TTransactionRequiredAuthorities[] = [];
    for (let i = 0; i < store.$state.processedTransaction.operations.length; ++i) {
      const requiredAuthorityForOperation = await store.$state.processedTransaction.requiredAuthoritiesForOperations(i);

      authoritiesForOperation.push(requiredAuthorityForOperation);
    }

    store.$state.authoritiesForOperation = authoritiesForOperation;

    const authorityPath = await getAuthorityPath($chain, trx.value as unknown as ApiTransaction);

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
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitTransaction();

    if (trx.value !== undefined)
      store.$state.trxDialogOpen = false;
  }
};
</script>
