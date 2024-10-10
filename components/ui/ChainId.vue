<template>
  <s-dialog v-model:open="open">
    <s-dialog-trigger as-child>
      <Button class="button">
        Change chain ID
      </Button>
    </s-dialog-trigger>
    <s-dialog-content>
      <s-dialog-header>
        <s-dialog-title>
          Change chain ID
        </s-dialog-title>
      </s-dialog-header>
      <s-input v-model="chainId" placeholder="Endpoint url" @keydown.enter="handleKeydown" />
      <s-dialog-footer class="flex flex-row-reverse sm:justify-between">
        <s-dialog-close as-child>
          <Button @click="changeChainId()">
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

const localStorage = useLocalStorage('chainId', $txInspector.config.chainId);

const chainId = ref(localStorage.value);

const waxStore = useWaxStore();
const store = storeToRefs(waxStore);

const changeChainId = async (): Promise<void> => {
  try {
    localStorage.value = chainId.value;
    await $txInspector.changeConfig(chainId.value, $txInspector.config.apiEndpoint, store.id.value, store.json.value as unknown as ApiTransaction);
  } catch (error) {
    toast.error('Error changing chain ID or cannot process the transaction with the new chain ID');
  }
};

const backToDefault = async (): Promise<void> => {
  localStorage.value = 'beeab0de00000000000000000000000000000000000000000000000000000000';
  chainId.value = localStorage.value;
  await $txInspector.changeConfig(chainId.value, $txInspector.config.apiEndpoint, store.id.value, store.json.value as unknown as ApiTransaction);
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault();
    changeChainId();
    open.value = false;
  }
};
</script>
