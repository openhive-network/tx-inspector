<template>
  <footer class="text-sm text-center mb-3">
    <span class="inline-flex items-center">
      Transaction Inspector by HIVE &copy; {{ new Date().getFullYear() }}
    </span>
    <span class="mx-2">
      Last commit hash: {{ commitHash }}
    </span>
    <span>
      Endpoint URL: {{ endpointUrl }}
    </span>
    <span>
      Chain ID: {{ chainId }}
    </span>
  </footer>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core';

const commitHash = COMMIT_HASH.slice(0, 7);

const endpointUrl = useLocalStorage('endpointUrl', 'https://api.hive.blog');
const chainId = useLocalStorage('chainId', 'beeab0de00000000000000000000000000000000000000000000000000000000');
</script>
