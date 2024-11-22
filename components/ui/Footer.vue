<template>
  <footer class="text-sm text-center mb-3 flex flex-col">
    <div>
      <span class="inline-flex items-center">
        Transaction Inspector by HIVE &copy; {{ new Date().getFullYear() }}
      </span>
      <span class="mx-2">
        Last commit hash: {{ commitHash }}
      </span>
      <span>
        Transaction processing time: {{ Number.isNaN(store.processingTime.value) ? 0 : store.processingTime.value }} seconds
      </span>
    </div>
    <div>
      <span>
        Endpoint URL:
        <s-dialog v-model:open="openEndpointUrl">
          <s-dialog-trigger as-child>
            <span class="inline-flex gap-1 text-blue cursor-pointer hover:underline">
              <span>{{ endpointUrl }}</span> <v-icon size="16px">mdi-note-edit-outline</v-icon>
            </span>
          </s-dialog-trigger>
          <s-dialog-content>
            <s-dialog-header>
              <s-dialog-title>
                Change endpoint URL
              </s-dialog-title>
            </s-dialog-header>
            <s-input v-model="endpointUrl" placeholder="Endpoint url" @keydown.enter="handleEndpointUrlKeydown" />
            <s-dialog-footer class="flex flex-row-reverse sm:justify-between">
              <s-dialog-close as-child>
                <Button @click="changeEndpointUrl()">
                  Save
                </Button>
              </s-dialog-close>
              <s-dialog-close>
                <s-button variant="ghost" @click="backEndpointUrlToDefault()">
                  Back to default
                </s-button>
              </s-dialog-close>
            </s-dialog-footer>
          </s-dialog-content>
        </s-dialog>
      </span>
      <span class="mx-2">
        Chain ID:
        <s-dialog v-model:open="openChainId">
          <s-dialog-trigger as-child>
            <span class="inline-flex gap-1 text-blue cursor-pointer hover:underline">
              <span>{{ chainId }}</span> <v-icon size="16px">mdi-note-edit-outline</v-icon>
            </span>
          </s-dialog-trigger>
          <s-dialog-content>
            <s-dialog-header>
              <s-dialog-title>
                Change chain ID
              </s-dialog-title>
            </s-dialog-header>
            <s-input v-model="chainId" placeholder="Endpoint url" @keydown.enter="handleChainIdKeydown" />
            <s-dialog-footer class="flex flex-row-reverse sm:justify-between">
              <s-dialog-close as-child>
                <Button @click="changeChainId()">
                  Save
                </Button>
              </s-dialog-close>
              <s-dialog-close>
                <s-button variant="ghost" @click="backChainIdToDefault()">
                  Back to default
                </s-button>
              </s-dialog-close>
            </s-dialog-footer>
          </s-dialog-content>
        </s-dialog>
      </span>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import type { ApiTransaction } from '@hiveio/wax';
import { toast } from 'vue-sonner';
import Button from '~/components/ui/Button.vue';

const commitHash = COMMIT_HASH.slice(0, 7);

const { $txInspector } = useNuxtApp();

const config = useRuntimeConfig();

const endpointUrl = ref($txInspector.config.apiEndpoint);
const chainId = ref($txInspector.config.chainId);

const waxStore = useWaxStore();
const store = storeToRefs(waxStore);

const openEndpointUrl = ref(false);
const openChainId = ref(false);

const changeEndpointUrl = async (): Promise<void> => {
  try {
    await $txInspector.changeConfig($txInspector.config.chainId, endpointUrl.value, store.id.value, store.json.value as unknown as ApiTransaction);
  } catch (error) {
    toast.error('Error changing endpoint URL or cannot process the transaction with the new endpoint URL');
  }
};

const backEndpointUrlToDefault = async (): Promise<void> => {
  endpointUrl.value = config.public.defaultEndpointUrl;
  await $txInspector.changeConfig($txInspector.config.chainId, endpointUrl.value, store.id.value, store.json.value as unknown as ApiTransaction);
};

const handleEndpointUrlKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault();
    changeEndpointUrl();
    openEndpointUrl.value = false;
  }
};

const changeChainId = async (): Promise<void> => {
  try {
    await $txInspector.changeConfig(chainId.value, $txInspector.config.apiEndpoint, store.id.value, store.json.value as unknown as ApiTransaction);
  } catch (error) {
    toast.error('Error changing chain ID or cannot process the transaction with the new chain ID');
  }
};

const backChainIdToDefault = async (): Promise<void> => {
  chainId.value = config.public.defaultChainId;
  await $txInspector.changeConfig(chainId.value, $txInspector.config.apiEndpoint, store.id.value, store.json.value as unknown as ApiTransaction);
};

const handleChainIdKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault();
    changeChainId();
    openChainId.value = false;
  }
};
</script>
