<template>
  <div class="flex flex-col">
    <div class="my-2">
      <s-label>
        Transaction ({{ radioState }} format)
      </s-label>
      <s-input
        v-if="radioState === 'hash'"
        v-model="hash"
        placeholder="Provide your transaction hash"
        class="my-3"
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
    <s-dialog-footer class="flex justify-between sm:justify-between items-center">
      <s-radio-group v-model="radioState" default-value="json">
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
      <s-dialog-close as-child>
        <Button @click="submitTransaction()">
          Submit
        </Button>
      </s-dialog-close>
    </s-dialog-footer>
  </div>
</template>

<script lang="ts" setup>
import type { ApiTransaction } from '@hiveio/wax';
import { toast } from '../shadcn/toast';
import Button from '~/components/ui/Button.vue';

const store = useWaxStore();

const { $wax } = useNuxtApp();

const radioState = ref('json');

const trx = defineModel<string>('transaction');
const hash = defineModel<string>('hash');

const useOperationsFormatter = (operations: any) => {
  const { $formatter } = useNuxtApp();

  return $formatter.format(operations);
};

const submitTransaction = async () => {
  store.$state.isLoading = false;
  try {
    store.$state.isLoading = true;

    if (radioState.value === 'hash') {
      if (hash.value === undefined)
        throw new Error('Hash is required');

      (trx.value as unknown as ApiTransaction) = await $wax.getTransactionFromId(hash.value!);
    } else if (radioState.value === 'json') {
      if (trx.value === undefined)
        throw new Error('Transaction is required');

      trx.value = JSON.parse(String(trx.value!.trim()));
    } else
      throw new Error('Provide transaction in choosen format');

    const authorityPath = await getAuthorityPath($wax, trx.value as unknown as ApiTransaction);

    store.$state.signatures = $wax.getSignatures(trx.value as unknown as ApiTransaction);
    store.$state.pack = await $wax.getPackType(trx.value as unknown as ApiTransaction);
    store.$state.publicKeys = await $wax.getSignatureKeys(trx.value as unknown as ApiTransaction);
    store.$state.id = await $wax.getTransactionId(trx.value as unknown as ApiTransaction);
    store.$state.sigDigest = await $wax.getSigDigest(trx.value as unknown as ApiTransaction);
    store.$state.authorityType = await $wax.getAuthorityType(trx.value as unknown as ApiTransaction);
    store.$state.isValid = await $wax.checkVerifyAuthority(trx.value as unknown as ApiTransaction);
    store.$state.operations = await $wax.getOperationsFromTransaction(trx.value as unknown as ApiTransaction);
    store.$state.signeesByKeys = await $wax.findSigneesForKeys(store.$state.publicKeys);
    store.$state.formattedOperations = useOperationsFormatter(trx.value).operations;

    console.log(store.$state.signeesByKeys);

    if (authorityPath) {
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
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Unknown error occured',
      variant: 'destructive'
    });
  } finally {
    store.$state.isLoading = false;
  }
};
</script>
