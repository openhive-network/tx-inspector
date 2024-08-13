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
  </footer>
</template>

<script lang="ts" setup>
const commitHash = COMMIT_HASH.slice(0, 7);
// XXX: Fetch dynamically in the future
const endpointUrl = 'http://test.com';
</script>
