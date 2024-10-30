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
          <s-radio-group-item id="binary" value="binary" />
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
      <s-input
        v-else-if="radioState === 'binary'"
        v-model="binary"
        placeholder="Provide your transaction hexstring"
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
import { toast } from 'vue-sonner';
import Button from '~/components/ui/Button.vue';

const store = useWaxStore();

const { $chain, $txInspector, $formatter } = useNuxtApp();

const radioState = ref('json');

const trx = ref<string>();
const hash = ref<string>();
const binary = ref<string>();

onMounted(() => {
  store.$state.qs = new URLSearchParams(location.search);

  if (store.$state.qs.has('transaction')) {
    const transaction = store.$state.qs.get('transaction');
    if (transaction)
      try {
        JSON.parse(atob(transaction));
        trx.value = atob(transaction);
      } catch {
        if (transaction.length === 40)
          hash.value = transaction;
        else
          binary.value = transaction;
      }
  }
});

const qs = store.$state.qs;

const submitTransaction = async () => {
  store.$state.isLoading = false;
  store.$state.authorityPath.length = 0;
  store.$state.processingTime = 0;

  let start!: number;
  let end!: number;
  let processingTime!: number;
  qs.delete('transaction');
  try {
    store.$state.isLoading = true;
    start = Date.now();

    if (radioState.value === 'hash') {
      if (hash.value) {
        store.$state.qs.set('transaction', hash.value);
        await store.handleTransactionFromHash($txInspector, $formatter, hash.value);
      }
    } else if (radioState.value === 'json') {
      if (trx.value) {
        store.$state.qs.set('transaction', btoa(trx.value));
        await store.handleTransactionFromJson($txInspector, $formatter, trx.value);
      }
    } else if (radioState.value === 'binary') {
      if (binary.value) {
        store.$state.qs.set('transaction', binary.value);
        await store.handleTransactionFromBinary($txInspector, $formatter, binary.value);
      }
    } else
      throw new Error('Provide transaction in choosen format');

    await store.handleAuthorityPath($chain);

    window.history.replaceState({}, '', `${location.pathname}?${store.qs.toString()}`);
  } catch (error) {
    toast.error('Error', {
      description: error instanceof Error ? error.message : 'Unknown error occured'
    });
  } finally {
    store.$state.isLoading = false;
    end = Date.now();

    processingTime = Number(((end - start) / 1000).toFixed(2));
    store.$state.processingTime = processingTime;
  }
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitTransaction();

    if (trx.value !== undefined || hash.value !== undefined || binary.value !== undefined)
      store.$state.trxDialogOpen = false;
  }
};
</script>
