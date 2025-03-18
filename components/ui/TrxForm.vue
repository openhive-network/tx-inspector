<template>
  <div class="flex flex-col" @keydown.enter="handleKeydown">
    <div class="my-2">
      <s-radio-group v-model="radioState" default-value="json" class="flex mb-3">
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="json-form" value="json" />
          <s-label for="json-form">
            JSON
          </s-label>
        </div>
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="hash-form" value="hash" />
          <s-label for="hash-form">
            Hash (ID)
          </s-label>
        </div>
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="binary-form" value="binary" />
          <s-label for="binary-form">
            Binary
          </s-label>
        </div>
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="file" value="file" />
          <s-label for="file">
            Upload File
          </s-label>
        </div>
      </s-radio-group>
      <s-label>
        Transaction ({{ radioState !== 'file' ? radioState : 'upload file with transaction in json/binary' }} format)
      </s-label>
      <v-text-field
        v-if="radioState === 'hash'"
        v-model="hash"
        placeholder="Provide your transaction hash"
        class="mt-3 mb-[12.9rem]"
        required
        autofocus
        variant="outlined"
        density="compact"
      />
      <v-text-field
        v-else-if="radioState === 'binary'"
        v-model="binary"
        placeholder="Provide your transaction hexstring"
        class="mt-3 mb-[12.9rem]"
        required
        autofocus
        variant="outlined"
        density="compact"
      />
      <v-file-input
        v-else-if="radioState === 'file'"
        v-model="file"
        label="Upload your transaction file"
        class="mt-3 mb-[12.9rem]"
        required
        autofocus
        variant="outlined"
        density="compact"
      />
      <v-textarea
        v-else
        v-model="trx"
        :placeholder="`Provide your transaction ${radioState}`"
        class="min-h-64 max-h-64 my-3 text-small"
        required
        autofocus
        no-resize
        variant="outlined"
        density="compact"
        rows="10"
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
import { decompressFromEncodedURIComponent, compressToEncodedURIComponent } from 'lz-string';
import Button from '~/components/ui/Button.vue';

const MAX_URL_LENGTH = 1024;

const store = useWaxStore();

const { $txInspector, $formatter, $buffer } = useNuxtApp();

const radioState = ref('json');

const trx = ref<string>();
const hash = ref<string>();
const binary = ref<string>();
const file = ref<File>();

onMounted(() => {
  store.$state.qs = new URLSearchParams(location.search);

  if (store.$state.qs.has('transaction')) {
    const transaction = store.$state.qs.get('transaction');
    if (transaction)
      try {
        JSON.parse(decodeURIComponent(decompressFromEncodedURIComponent(transaction)));
        trx.value = decodeURIComponent(decompressFromEncodedURIComponent(transaction));
      } catch {
        if (transaction.length === 40)
          hash.value = transaction;
        else
          binary.value = transaction;
      }
  }
});

const qs = store.$state.qs;

const handleHexadecimalFile = async (hexadecimalValue: string) => {
  if (`${location.origin}/?transaction=${hexadecimalValue}`.length < MAX_URL_LENGTH)
    store.$state.qs.set('transaction', hexadecimalValue);
  else {
    store.$state.qs.delete('transaction');
    toast.info('Info', {
      description: 'Transaction is too long to be stored in URL'
    });
  }

  await store.handleTransactionFromBinary($txInspector, $formatter, hexadecimalValue);
  window.history.replaceState({}, '', `${location.pathname}?${store.qs.toString()}`);
  store.$state.isLoading = false;
};

const handleJSONFile = async (jsonValue: any) => {
  if (`${location.origin}/?transaction=${compressToEncodedURIComponent(encodeURIComponent(jsonValue))}`.length < MAX_URL_LENGTH)
    store.$state.qs.set('transaction', compressToEncodedURIComponent(encodeURIComponent(jsonValue)));
  else {
    store.$state.qs.delete('transaction');
    toast.info('Info', {
      description: 'Transaction is too long to be stored in URL'
    });
  }

  await store.handleTransactionFromJson($txInspector, $formatter, jsonValue);
  window.history.replaceState({}, '', `${location.pathname}?${store.qs.toString()}`);
  store.$state.isLoading = false;
};

const handleBinaryFile = async (binaryValue: string) => {
  const binary = $buffer.from(binaryValue, 'ascii').toString('hex');

  if (`${location.origin}/?transaction=${binary}`.length < MAX_URL_LENGTH)
    store.$state.qs.set('transaction', binary);
  else {
    store.$state.qs.delete('transaction');
    toast.info('Info', {
      description: 'Transaction is too long to be stored in URL'
    });
  }

  await store.handleTransactionFromBinary($txInspector, $formatter, binary);
  window.history.replaceState({}, '', `${location.pathname}?${store.qs.toString()}`);
  store.$state.isLoading = false;
};

const handleTransactionFromHash = async (): Promise<void> => {
  if (hash.value) {
    store.$state.qs.set('transaction', hash.value);
    await store.handleTransactionFromHash($txInspector, $formatter, hash.value);
    store.$state.isLoading = false;
  }

  window.history.replaceState({}, '', `${location.pathname}?${store.qs.toString()}`);
};

const handleTransactionFromJson = async (): Promise<void> => {
  if (trx.value) {
    if (`${location.origin}/?transaction=${compressToEncodedURIComponent(encodeURIComponent(trx.value))}`.length < MAX_URL_LENGTH)
      store.$state.qs.set('transaction', compressToEncodedURIComponent(encodeURIComponent(trx.value)));
    else {
      store.$state.qs.delete('transaction');
      toast.info('Info', {
        description: 'Transaction is too long to be stored in URL'
      });
    }

    await store.handleTransactionFromJson($txInspector, $formatter, trx.value);
    store.$state.isLoading = false;
  }

  window.history.replaceState({}, '', `${location.pathname}?${store.qs.toString()}`);
};

const handleTransactionFromBinary = async (): Promise<void> => {
  if (binary.value) {
    if (`${location.origin}/?transaction=${binary.value}`.length < MAX_URL_LENGTH)
      store.$state.qs.set('transaction', binary.value);
    else {
      store.$state.qs.delete('transaction');
      toast.info('Info', {
        description: 'Transaction is too long to be stored in URL'
      });
    }

    await store.handleTransactionFromBinary($txInspector, $formatter, binary.value);
    store.$state.isLoading = false;
  }

  window.history.replaceState({}, '', `${location.pathname}?${store.qs.toString()}`);
};

const readFromFile = (): void => {
  const localFileValue = file.value;
  if (localFileValue) {
    const textReader = new FileReader();
    const binaryReader = new FileReader();
    textReader.onload = async () => {
      try {
        const result = (textReader.result as string).trim();
        if (/^[0-9a-fA-F]+$/.test(result))
          await handleHexadecimalFile(result);
        else {
          // If JSON parse throws error go to binary file handling.
          JSON.parse(result);
          await handleJSONFile(result);
        }
      } catch (error) {
        binaryReader.onload = async () => {
          const result = binaryReader.result as string;
          await handleBinaryFile(result);
        };
        binaryReader.readAsArrayBuffer(localFileValue);
      }
    };
    textReader.readAsText(localFileValue);
  } else
    throw new Error('Provide transaction in choosen format');
};

const submitTransaction = async () => {
  store.$state.isLoading = false;
  store.$state.processingTime = 0;

  let start!: number;
  let end!: number;
  let processingTime!: number;
  qs.delete('transaction');
  try {
    store.$state.isLoading = true;
    start = Date.now();

    if (radioState.value === 'hash')
      await handleTransactionFromHash();
    else if (radioState.value === 'json')
      await handleTransactionFromJson();
    else if (radioState.value === 'binary')
      await handleTransactionFromBinary();
    else if (radioState.value === 'file')
      readFromFile();
    else
      throw new Error('Provide transaction in choosen format');
  } catch (error) {
    toast.error('Error', {
      description: error instanceof Error ? error.message : 'Unknown error occured'
    });
  } finally {
    end = Date.now();

    processingTime = Number(((end - start) / 1000).toFixed(2));
    store.$state.processingTime = processingTime;
  }
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitTransaction();

    if (trx.value !== undefined || hash.value !== undefined || binary.value !== undefined || file.value !== undefined)
      store.$state.trxDialogOpen = false;
  }
};
</script>
