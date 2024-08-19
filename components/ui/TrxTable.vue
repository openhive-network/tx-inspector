<template>
  <div>
    <h3>Transaction:</h3>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <s-table v-else>
      <s-table-header class="table-header">
        <s-table-row>
          <s-table-head>ID</s-table-head>
          <s-table-head>Sig Digest</s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row v-if="store.id.value.length > 0">
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

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
