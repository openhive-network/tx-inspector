<template>
  <div>
    <Subtitle class="mb-3">
      Required Authorities:
    </Subtitle>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <s-table v-else>
      <s-table-header>
        <s-table-row>
          <s-table-head>Matching signature</s-table-head>
          <s-table-head>Authority accounts</s-table-head>
          <s-table-head>Authority type</s-table-head>
          <s-table-head>Satisfied</s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row
          v-for="(signature, index) in store.processedTransaction.value.signatures"
          v-if="store.processedTransaction.value.transactionId !== ''"
          :key="index"
        >
          <s-table-cell>
            <s-tooltip-provider>
              <s-tooltip>
                <s-tooltip-trigger as-child>
                  <span
                    class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
                    @click="waxStore.copy(signature)"
                  >
                    <span>
                      {{ `${signature.slice(0, 5)}...${signature.slice(-5)}` }}
                    </span>
                    <v-icon size="md">mdi-content-copy</v-icon>
                  </span>
                </s-tooltip-trigger>
                <s-tooltip-content>
                  <div class="flex flex-col">
                    <span class="text-lg">Signature:</span>
                    <hr class="my-2">
                    <span>{{ signature }}</span>
                  </div>
                </s-tooltip-content>
              </s-tooltip>
            </s-tooltip-provider>
          </s-table-cell>
          <s-table-cell>
            <span class="flex flex-col">
              <a v-for="(item, key) in store.processedTransaction.value.authorityType" :key="key" class="my-2 text-blue" :href="`https://explore.openhive.network/@${Array.isArray(item.accounts) ? item.accounts[index] : Array.from(item.accounts)[index]}`">
                {{ `@${Array.isArray(item.accounts) ? item.accounts[index] : Array.from(item.accounts)[index]}` }}
              </a>
            </span>
          </s-table-cell>
          <s-table-cell class="p-5">
            <span
              :class="{
                'text-green': store.processedTransaction.value.authorityType[0].level === 'Posting',
                'text-blue': store.processedTransaction.value.authorityType[0].level === 'Active',
                'text-orange': store.processedTransaction.value.authorityType[0].level === 'Owner' }"
            >
              {{ store.processedTransaction.value.authorityType[0].level }}
            </span>
          </s-table-cell>
          <s-table-cell class="p-5">
            <v-icon :color="store.isSatisfied.value ? 'green' : 'red'">
              {{ store.isSatisfied.value ? 'mdi-check' : 'mdi-close' }}
            </v-icon>
          </s-table-cell>
        </s-table-row>
      </s-table-body>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
import Subtitle from './Subtitle.vue';

const waxStore = useWaxStore();
const store = storeToRefs(waxStore);
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
