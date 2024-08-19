<template>
  <div class="flex flex-col">
    <div class="my-2">
      <s-label>
        Transaction ({{ radioState }} format)
      </s-label>
      <s-input
        v-if="radioState === 'hash'"
        v-model="trx"
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
          <s-radio-group-item id="binary" value="binary" />
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
import Button from '~/components/ui/Button.vue';

const store = useWaxStore();

const { $wax } = useNuxtApp();

const radioState = ref('json');

const trx = defineModel<string>('transaction');

const submitTransaction = async () => {
  store.$state.isLoading = false;
  try {
    store.$state.isLoading = true;
    if (trx.value === undefined)
      throw new Error('Transaction is required');

    store.$state.signatures = $wax.getSignatures(JSON.parse(String(trx.value!.trim())) as ApiTransaction);
    store.$state.pack = await $wax.getPackType(JSON.parse(String(trx.value!.trim())) as ApiTransaction);
    store.$state.publicKeys = await $wax.getSignatureKeys(JSON.parse(String(trx.value!.trim())) as ApiTransaction);
    store.$state.authorityPath = await getAuthorityPath($wax, JSON.parse(String(trx.value!.trim())) as ApiTransaction);
    store.$state.id = await $wax.getTransactionId(JSON.parse(String(trx.value!.trim())) as ApiTransaction);
    store.$state.sigDigest = await $wax.getSigDigest(JSON.parse(String(trx.value!.trim())) as ApiTransaction);
  } catch (error) {
    console.error(error);
  } finally {
    store.$state.isLoading = false;
  }
};
</script>
