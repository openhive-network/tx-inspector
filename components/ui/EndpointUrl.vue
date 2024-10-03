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
import { useLocalStorage } from '@vueuse/core';
import Button from '~/components/ui/Button.vue';

const open = ref(false);

const { $wax } = useNuxtApp();

const localStorage = useLocalStorage('endpointUrl', 'https://api.hive.blog');

const endpointUrl = ref(localStorage.value);

const changeEndpointUrl = async (): Promise<void> => {
  try {
    localStorage.value = endpointUrl.value;
    await $wax.changeEndpointUrl(endpointUrl.value);
  } catch (error) {
    console.error(error);
  }
};

const backToDefault = async (): Promise<void> => {
  localStorage.value = 'https://api.hive.blog';
  endpointUrl.value = localStorage.value;
  await $wax.changeEndpointUrl(endpointUrl.value);
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    event.preventDefault();
    changeEndpointUrl();
    open.value = false;
  }
};
</script>
