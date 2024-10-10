<template>
  <s-dialog v-model:open="open">
    <s-dialog-trigger as-child>
      <Button class="button">
        Change endpoint url
      </Button>
    </s-dialog-trigger>
    <s-dialog-content>
      <s-dialog-header>
        <s-dialog-title>
          Change endpoint URL
        </s-dialog-title>
      </s-dialog-header>
      <s-input v-model="endpointUrl" placeholder="Endpoint url" @keydown.enter="handleKeydown" />
      <s-dialog-footer class="flex flex-row-reverse sm:justify-between">
        <s-dialog-close as-child>
          <Button @click="changeEndpointUrl()">
            Save
          </Button>
        </s-dialog-close>
        <s-dialog-close>
          <Button @click="backToDefault()">
            Back to default
          </Button>
        </s-dialog-close>
      </s-dialog-footer>
    </s-dialog-content>
  </s-dialog>
</template>

<script lang="ts" setup>
import type { ApiTransaction } from '@hiveio/wax';
import { useLocalStorage } from '@vueuse/core';
import { toast } from 'vue-sonner';
import Button from '~/components/ui/Button.vue';

const open = ref(false);

const { $txInspector } = useNuxtApp();

const localStorage = useLocalStorage('endpointUrl', $txInspector.config.apiEndpoint);

const endpointUrl = ref(localStorage.value);

const waxStore = useWaxStore();
const store = storeToRefs(waxStore);

const changeEndpointUrl = async (): Promise<void> => {
  try {
    localStorage.value = endpointUrl.value;
    await $txInspector.changeConfig($txInspector.config.chainId, endpointUrl.value, store.id.value, store.json.value as unknown as ApiTransaction);
  } catch (error) {
    toast.error('Error changing endpoint URL or cannot process the transaction with the new endpoint URL');
  }
};

const backToDefault = async (): Promise<void> => {
  localStorage.value = 'https://api.hive.blog';
  endpointUrl.value = localStorage.value;
  await $txInspector.changeConfig($txInspector.config.chainId, endpointUrl.value, store.id.value, store.json.value as unknown as ApiTransaction);
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault();
    changeEndpointUrl();
    open.value = false;
  }
};
</script>
