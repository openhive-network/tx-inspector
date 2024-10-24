<template>
  <div>
    <Subtitle class="mb-3">
      Transaction:
    </Subtitle>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <s-table v-else>
      <s-table-header>
        <s-table-row>
          <s-table-head>ID</s-table-head>
          <s-table-head>Sig Digest</s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row v-if="store.processedTransaction.value.transactionId !== ''">
          <s-table-cell>
            <s-tooltip-provider>
              <s-tooltip>
                <s-tooltip-trigger v-if="typeof store.processedTransaction.value.transactionId === 'string'" as-child>
                  <span
                    class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
                    @click="waxStore.copy(store.processedTransaction.value.transactionId)"
                  >
                    <span>
                      {{ `${store.processedTransaction.value.transactionId.slice(0, 5)}...${store.processedTransaction.value.transactionId.slice(-5)}` }}
                    </span>
                    <v-icon size="md">mdi-content-copy</v-icon>
                  </span>
                </s-tooltip-trigger>
                <div v-else class="flex flex-col">
                  <s-tooltip-provider>
                    <s-tooltip>
                      <s-tooltip-trigger as-child>
                        <span
                          class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer mb-3"
                          @click="waxStore.copy(store.processedTransaction.value.transactionId.hf26)"
                        >
                          <span>
                            HF26: {{ `${store.processedTransaction.value.transactionId.hf26.slice(0, 5)}...${store.processedTransaction.value.transactionId.hf26.slice(-5)}` }}
                          </span>
                          <v-icon size="md">mdi-content-copy</v-icon>
                        </span>
                      </s-tooltip-trigger>
                      <s-tooltip-content>
                        <div class="flex flex-col">
                          <span class="text-lg">HF26 ID</span>
                          <hr class="my-2">
                          <span>{{ store.processedTransaction.value.transactionId.legacy }}</span>
                        </div>
                      </s-tooltip-content>
                    </s-tooltip>
                  </s-tooltip-provider>
                  <s-tooltip-trigger as-child>
                    <span
                      class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer mb-3"
                      @click="waxStore.copy(store.processedTransaction.value.transactionId.legacy)"
                    >
                      <span>
                        Legacy: {{ `${store.processedTransaction.value.transactionId.legacy.slice(0, 5)}...${store.processedTransaction.value.transactionId.legacy.slice(-5)}` }}
                      </span>
                      <v-icon size="md">mdi-content-copy</v-icon>
                    </span>
                  </s-tooltip-trigger>
                  <s-tooltip-content>
                    <div class="flex flex-col">
                      <span class="text-lg">Legacy ID</span>
                      <hr class="my-2">
                      <span>{{ store.processedTransaction.value.transactionId.legacy }}</span>
                    </div>
                  </s-tooltip-content>
                </div>
                <s-tooltip-content v-if="typeof store.processedTransaction.value.transactionId === 'string'">
                  <div class="flex flex-col">
                    <span class="text-lg">ID</span>
                    <hr class="my-2">
                    <span>{{ store.processedTransaction.value.transactionId }}</span>
                  </div>
                </s-tooltip-content>
              </s-tooltip>
            </s-tooltip-provider>
          </s-table-cell>
          <s-table-cell>
            <s-tooltip-provider>
              <s-tooltip>
                <s-tooltip-trigger v-if="typeof store.processedTransaction.value.sigDigest === 'string'" as-child>
                  <span
                    class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
                    @click="waxStore.copy(store.processedTransaction.value.sigDigest)"
                  >
                    <span>
                      {{ `${store.processedTransaction.value.sigDigest.slice(0, 5)}...${store.processedTransaction.value.sigDigest.slice(-5)}` }}
                    </span>
                    <v-icon size="md">mdi-content-copy</v-icon>
                  </span>
                </s-tooltip-trigger>
                <div v-else class="flex flex-col">
                  <s-tooltip-provider>
                    <s-tooltip>
                      <s-tooltip-trigger as-child>
                        <span
                          class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer mb-3"
                          @click="waxStore.copy(store.processedTransaction.value.sigDigest.hf26)"
                        >
                          <span>
                            HF26: {{ `${store.processedTransaction.value.sigDigest.hf26.slice(0, 5)}...${store.processedTransaction.value.sigDigest.hf26.slice(-5)}` }}
                          </span>
                          <v-icon size="md">mdi-content-copy</v-icon>
                        </span>
                      </s-tooltip-trigger>
                      <s-tooltip-content>
                        <div class="flex flex-col">
                          <span class="text-lg">HF26 Sig Digest</span>
                          <hr class="my-2">
                          <span>{{ store.processedTransaction.value.sigDigest.hf26 }}</span>
                        </div>
                      </s-tooltip-content>
                    </s-tooltip>
                  </s-tooltip-provider>
                  <s-tooltip-trigger as-child>
                    <span
                      class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer mb-3"
                      @click="waxStore.copy(store.processedTransaction.value.sigDigest.legacy)"
                    >
                      <span>
                        Legacy: {{ `${store.processedTransaction.value.sigDigest.legacy.slice(0, 5)}...${store.processedTransaction.value.sigDigest.legacy.slice(-5)}` }}
                      </span>
                      <v-icon size="md">mdi-content-copy</v-icon>
                    </span>
                  </s-tooltip-trigger>
                  <s-tooltip-content>
                    <div class="flex flex-col">
                      <span class="text-lg">Legacy Sig Digest</span>
                      <hr class="my-2">
                      <span>{{ store.processedTransaction.value.sigDigest.legacy }}</span>
                    </div>
                  </s-tooltip-content>
                </div>
                <s-tooltip-content v-if="typeof store.processedTransaction.value.sigDigest === 'string'">
                  <div class="flex flex-col">
                    <span class="text-lg">Sig Digest</span>
                    <hr class="my-2">
                    <span>{{ store.processedTransaction.value.sigDigest }}</span>
                  </div>
                </s-tooltip-content>
              </s-tooltip>
            </s-tooltip-provider>
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
