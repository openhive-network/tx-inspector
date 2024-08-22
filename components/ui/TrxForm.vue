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
import Button from '~/components/ui/Button.vue';

const store = useWaxStore();

const { $wax } = useNuxtApp();

const radioState = ref('json');

const trx = defineModel<string>('transaction');
const hash = defineModel<string>('hash');

const route = useRoute();

const submitTransaction = async () => {
  store.$state.isLoading = false;
  try {
    console.log(route);
    store.$state.isLoading = true;

    if (radioState.value === 'hash') {
      if (hash.value === undefined)
        throw new Error('Hash is required');

      trx.value = await $wax.getTransactionFromId(hash.value!);

      const authorityPath = await getAuthorityPath($wax, trx.value);

      store.$state.signatures = $wax.getSignatures(trx.value);
      store.$state.pack = await $wax.getPackType(trx.value);
      store.$state.publicKeys = await $wax.getSignatureKeys(trx.value);
      store.$state.id = await $wax.getTransactionId(trx.value);
      store.$state.sigDigest = await $wax.getSigDigest(trx.value);
      store.$state.authorityType = await $wax.getAuthorityType(trx.value);
      store.$state.isValid = await $wax.checkVerifyAuthority(trx.value);

      if (authorityPath)
        store.$state.authorityPath = authorityPath;
    } else if (radioState.value === 'json') {
      if (trx.value === undefined)
        throw new Error('Transaction is required');

      const authorityPath = await getAuthorityPath($wax, JSON.parse(String(trx.value!.trim())) as ApiTransaction);

      store.$state.signatures = $wax.getSignatures(JSON.parse(String(trx.value!.trim())) as ApiTransaction);
      store.$state.pack = await $wax.getPackType(JSON.parse(String(trx.value!.trim())) as ApiTransaction);
      store.$state.publicKeys = await $wax.getSignatureKeys(JSON.parse(String(trx.value!.trim())) as ApiTransaction);
      store.$state.id = await $wax.getTransactionId(JSON.parse(String(trx.value!.trim())) as ApiTransaction);
      store.$state.sigDigest = await $wax.getSigDigest(JSON.parse(String(trx.value!.trim())) as ApiTransaction);
      store.$state.authorityType = await $wax.getAuthorityType(JSON.parse(String(trx.value!.trim())) as ApiTransaction);
      store.$state.isValid = await $wax.checkVerifyAuthority(JSON.parse(String(trx.value!.trim())) as ApiTransaction);

      if (authorityPath)
        store.$state.authorityPath = authorityPath;
    } else
      throw new Error('Provide transaction in choosen format');
  } catch (error) {
    console.error(error);
  } finally {
    store.$state.isLoading = false;
  }
};
</script>
