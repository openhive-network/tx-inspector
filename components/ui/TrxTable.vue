<template>
  <div>
    <h3>Transaction:</h3>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <s-table v-else>
      <s-table-header>
        <s-table-row>
          <s-table-head>ID</s-table-head>
          <s-table-head>Sig Digest</s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row v-if="store.id.value.length > 0">
          <s-table-cell>
            <v-tooltip location="top">
              <template #activator="{props}">
                <span
                  v-bind="props"
                  class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
                  @click="waxStore.copy(store.id.value)"
                >
                  <span>
                    {{ `${store.id.value.slice(0, 5)}...${store.id.value.slice(-5)}` }}
                  </span>
                  <v-icon size="md">mdi-content-copy</v-icon>
                </span>
              </template>
              <div class="flex flex-col">
                <span class="text-lg">Transaction ID</span>
                <hr class="my-2">
                <span>{{ store.id.value }}</span>
              </div>
            </v-tooltip>
          </s-table-cell>
          <s-table-cell>
            <v-tooltip location="top">
              <template #activator="{props}">
                <span
                  v-bind="props"
                  class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
                  @click="waxStore.copy(store.sigDigest.value)"
                >
                  <span>
                    {{ `${store.sigDigest.value.slice(0, 5)}...${store.sigDigest.value.slice(-5)}` }}
                  </span>
                  <v-icon size="md">mdi-content-copy</v-icon>
                </span>
              </template>
              <div class="flex flex-col">
                <span class="text-lg">Sig Digest</span>
                <hr class="my-2">
                <span>{{ store.sigDigest.value }}</span>
              </div>
            </v-tooltip>
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
