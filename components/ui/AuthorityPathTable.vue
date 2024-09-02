<template>
  <div>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <s-table v-else>
      <s-table-header>
        <s-table-row>
          <s-table-head>Signature</s-table-head>
          <s-table-head>Pack</s-table-head>
          <s-table-head>Public key</s-table-head>
          <s-table-head>Authority path</s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row v-for="(signature, index) in store.signatures.value" :key="index">
          <s-table-cell>
            <v-tooltip location="top">
              <template #activator="{props}">
                <span
                  v-bind="props"
                  class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
                  @click="waxStore.copy(signature)"
                >
                  <span>
                    {{ `${signature.slice(0, 5)}...${signature.slice(-5)}` }}
                  </span>
                  <v-icon size="md">mdi-content-copy</v-icon>
                </span>
              </template>
              <div class="flex flex-col">
                <span class="text-lg">Signature:</span>
                <hr class="my-2">
                <span>{{ signature }}</span>
              </div>
            </v-tooltip>
          </s-table-cell>
          <s-table-cell>
            {{ store.pack.value }}
          </s-table-cell>
          <s-table-cell>
            <v-tooltip location="top">
              <template #activator="{props}">
                <span
                  v-bind="props"
                  class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
                  @click="waxStore.copy(store.publicKeys.value[index])"
                >
                  <span>{{ `${store.publicKeys.value[index].slice(0, 5)}...${store.publicKeys.value[index].slice(-5)}` }}</span>
                  <v-icon size="md">mdi-content-copy</v-icon>
                </span>
              </template>
              <div class="flex flex-col">
                <span class="text-lg">Public key:</span>
                <hr class="my-2">
                <span>{{ store.publicKeys.value[index] }}</span>
              </div>
            </v-tooltip>
          </s-table-cell>
          <s-table-cell>
            <span v-for="(item, key) in store.authorityPath.value" :key="key">
              {{ item.account }} {{ item.authWeight ? `(${item.authWeight.weight}/${item.authWeight.auth}) ` : '' }}
            </span>
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
