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
import { useLocalStorage } from '@vueuse/core';
import Button from '~/components/ui/Button.vue';

const open = ref(false);

const { $wax } = useNuxtApp();

const localStorage = useLocalStorage('chainId', 'beeab0de00000000000000000000000000000000000000000000000000000000');

const chainId = ref(localStorage.value);

const changeChainId = async (): Promise<void> => {
  try {
    localStorage.value = chainId.value;
    await $wax.changeChainId(chainId.value);
  } catch (error) {
    console.error(error);
  }
};

const backToDefault = async (): Promise<void> => {
  localStorage.value = 'beeab0de00000000000000000000000000000000000000000000000000000000';
  chainId.value = localStorage.value;
  await $wax.changeChainId(chainId.value);
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault();
    changeChainId();
    open.value = false;
  }
};
</script>
