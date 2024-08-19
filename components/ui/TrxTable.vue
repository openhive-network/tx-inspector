<template>
  <div>
    <h3>Transaction:</h3>
    <s-skeleton v-if="store.isLoading.value" />
    <s-table v-else>
      <s-table-header class="table-header">
        <s-table-row>
          <s-table-head>ID</s-table-head>
          <s-table-head>Sig Digest</s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row>
          <s-table-cell>
            {{ `${store.id.value.slice(0, 5)}...${store.id.value.slice(-5)}` }}
          </s-table-cell>
          <s-table-cell>
            {{ `${store.sigDigest.value.slice(0, 5)}...${store.sigDigest.value.slice(-5)}` }}
          </s-table-cell>
        </s-table-row>
      </s-table-body>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
const waxStore = useWaxStore();
const store = storeToRefs(waxStore);
</script>
