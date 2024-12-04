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
          <s-table-head>TaPoS</s-table-head>
          <s-table-head>Expiration time</s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row v-if="store.processedTransaction.value.transactionData.id !== ''">
          <s-table-cell>
            <s-tooltip-provider :delayDuration="350">
              <s-tooltip>
                <s-tooltip-trigger v-if="typeof store.processedTransaction.value.transactionData.id === 'string'" as-child>
                  <CopyWrapper :toCopy="store.processedTransaction.value.transactionData.id">
                    {{ waxStore.shortenString(store.processedTransaction.value.transactionData.id) }}
                  </CopyWrapper>
                </s-tooltip-trigger>
                <div v-else class="flex flex-col">
                  <s-tooltip-provider :delayDuration="350">
                    <s-tooltip>
                      <s-tooltip-trigger as-child>
                        <CopyWrapper :toCopy="store.processedTransaction.value.transactionData.id.hf26">
                          HF26: {{ waxStore.shortenString(store.processedTransaction.value.transactionData.id.hf26) }}
                        </CopyWrapper>
                      </s-tooltip-trigger>
                      <s-tooltip-content>
                        <div class="flex flex-col">
                          <span class="text-lg">HF26 ID</span>
                          <hr class="my-2">
                          <span>{{ store.processedTransaction.value.transactionData.id.hf26 }}</span>
                        </div>
                      </s-tooltip-content>
                    </s-tooltip>
                  </s-tooltip-provider>
                  <s-tooltip-trigger as-child>
                    <CopyWrapper :toCopy="store.processedTransaction.value.transactionData.id.legacy">
                      Legacy: {{ waxStore.shortenString(store.processedTransaction.value.transactionData.id.legacy) }}
                    </CopyWrapper>
                  </s-tooltip-trigger>
                  <s-tooltip-content>
                    <div class="flex flex-col">
                      <span class="text-lg">Legacy ID</span>
                      <hr class="my-2">
                      <span>{{ store.processedTransaction.value.transactionData.id.legacy }}</span>
                    </div>
                  </s-tooltip-content>
                </div>
                <s-tooltip-content v-if="typeof store.processedTransaction.value.transactionData.id === 'string'">
                  <div class="flex flex-col">
                    <span class="text-lg">ID</span>
                    <hr class="my-2">
                    <span>{{ store.processedTransaction.value.transactionData.id }}</span>
                  </div>
                </s-tooltip-content>
              </s-tooltip>
            </s-tooltip-provider>
          </s-table-cell>
          <s-table-cell>
            <s-tooltip-provider :delayDuration="350">
              <s-tooltip>
                <s-tooltip-trigger v-if="typeof store.processedTransaction.value.transactionData.sigDigest === 'string'" as-child>
                  <CopyWrapper :toCopy="store.processedTransaction.value.transactionData.sigDigest">
                    {{ waxStore.shortenString(store.processedTransaction.value.transactionData.sigDigest) }}
                  </CopyWrapper>
                </s-tooltip-trigger>
                <div v-else class="flex flex-col">
                  <s-tooltip-provider :delayDuration="350">
                    <s-tooltip>
                      <s-tooltip-trigger as-child>
                        <CopyWrapper :toCopy="store.processedTransaction.value.transactionData.sigDigest.hf26">
                          HF26: {{ waxStore.shortenString(store.processedTransaction.value.transactionData.sigDigest.hf26) }}
                        </CopyWrapper>
                      </s-tooltip-trigger>
                      <s-tooltip-content>
                        <div class="flex flex-col">
                          <span class="text-lg">HF26 Sig Digest</span>
                          <hr class="my-2">
                          <span>{{ store.processedTransaction.value.transactionData.sigDigest.hf26 }}</span>
                        </div>
                      </s-tooltip-content>
                    </s-tooltip>
                  </s-tooltip-provider>
                  <s-tooltip-trigger as-child>
                    <CopyWrapper :toCopy="store.processedTransaction.value.transactionData.sigDigest.legacy">
                      Legacy: {{ waxStore.shortenString(store.processedTransaction.value.transactionData.sigDigest.legacy) }}
                    </CopyWrapper>
                  </s-tooltip-trigger>
                  <s-tooltip-content>
                    <div class="flex flex-col">
                      <span class="text-lg">Legacy Sig Digest</span>
                      <hr class="my-2">
                      <span>{{ store.processedTransaction.value.transactionData.sigDigest.legacy }}</span>
                    </div>
                  </s-tooltip-content>
                </div>
                <s-tooltip-content v-if="typeof store.processedTransaction.value.transactionData.sigDigest === 'string'">
                  <div class="flex flex-col">
                    <span class="text-lg">Sig Digest</span>
                    <hr class="my-2">
                    <span>{{ store.processedTransaction.value.transactionData.sigDigest }}</span>
                  </div>
                </s-tooltip-content>
              </s-tooltip>
            </s-tooltip-provider>
          </s-table-cell>
          <s-table-cell>
            <span class="inline-flex flex-col">
              <span>Reference block number: <span class="font-medium">{{ store.processedTransaction.value.transactionData.tapos.refBlockNum }}</span></span>
              <hr class="my-2">
              <span>Reference block prefix: <span class="font-medium">{{ store.processedTransaction.value.transactionData.tapos.refBlockPrefix }}</span></span>
            </span>
          </s-table-cell>
          <s-table-cell>
            <CopyWrapper :toCopy="store.processedTransaction.value.transactionData.expirationTime">
              {{ store.processedTransaction.value.transactionData.expirationTime }}
            </CopyWrapper>
          </s-table-cell>
        </s-table-row>
      </s-table-body>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
import Subtitle from './Subtitle.vue';
import CopyWrapper from './CopyWrapper.vue';

const waxStore = useWaxStore();
const store = storeToRefs(waxStore);
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
