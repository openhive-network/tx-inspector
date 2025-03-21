<template>
  <div>
    <Subtitle class="mb-3">
      Transaction:
    </Subtitle>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <s-table v-else>
      <s-table-header>
        <s-table-row>
          <s-table-head>
            <Tooltip>
              <template #activator>
                <span class="flex items-center">
                  ID
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </span>
              </template>
              <template #content>
                <div class="flex flex-col overflow-x-scroll">
                  <span class="text-lg">Transaction ID</span>
                  <hr class="my-2">
                  <span>
                    ID of the transaction (transaction hash, which depends on the chosen pack type). <br>
                    Uniquely identifies the transaction within the blockchain network. <br>
                    When the pack type is unknown, both ID variants - HF26 and Legacy are displayed.
                  </span>
                </div>
              </template>
            </Tooltip>
          </s-table-head>
          <s-table-head>
            <Tooltip>
              <template #activator>
                <span class="flex items-center">
                  Sig Digest
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </span>
              </template>
              <template #content>
                <div class="flex flex-col overflow-x-scroll">
                  <span class="text-lg">Transaction Sig Digest</span>
                  <hr class="my-2">
                  <span>
                    The transaction digest calculated for signing purposes. <br>
                    It depends on transaction content (ID), chosen chain ID and the pack type. <br>
                    When the pack type is unknown, both Sig Digest variants - HF26 and Legacy are displayed.
                  </span>
                </div>
              </template>
            </Tooltip>
          </s-table-head>
          <s-table-head>
            <Tooltip>
              <template #activator>
                <span class="flex items-center">
                  TaPoS
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </span>
              </template>
              <template #content>
                <div class="flex flex-col overflow-x-scroll">
                  <span class="text-lg">Transaction TaPoS</span>
                  <hr class="my-2">
                  <span>
                    Part of transaction data, matching rules defined in Transaction as Proof of Stake to conform blockchain sanity. <br>
                    In HIVE TaPoS data are valid for 64k blocks.
                    You can find more information
                    <NuxtLink to="https://hive.pages.syncad.com/wax-doc/typescript/transaction-and-operation/#transaction-as-proof-of-stake-tapos" target="_blank" class="text-blue hover:opacity-70 transition-opacity">
                      here.
                    </NuxtLink>
                  </span>
                </div>
              </template>
            </Tooltip>
          </s-table-head>
          <s-table-head>
            <Tooltip>
              <template #activator>
                <span class="flex items-center">
                  Expiration time
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </span>
              </template>
              <template #content>
                <div class="flex flex-col overflow-x-scroll">
                  <span class="text-lg">Transaction expiration time</span>
                  <hr class="my-2">
                  <span>
                    The Expiration Time of the transaction indicates the time limit within the transaction must be included in a block to be considered valid. <br>
                    The maximum of expiration time in HIVE blockchain is 1 hour.
                  </span>
                </div>
              </template>
            </Tooltip>
          </s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row v-if="store.processedTransaction.value.transactionData.id !== ''">
          <s-table-cell>
            <CopyWrapper v-if="typeof store.processedTransaction.value.transactionData.id === 'string'" :toCopy="store.processedTransaction.value.transactionData.id">
              <Tooltip>
                <template #activator>
                  <span>{{ waxStore.shortenString(store.processedTransaction.value.transactionData.id) }}</span>
                </template>
                <template #content>
                  <div class="flex flex-col overflow-x-scroll">
                    <span class="text-lg">ID</span>
                    <hr class="my-2">
                    <span>{{ store.processedTransaction.value.transactionData.id }}</span>
                  </div>
                </template>
              </Tooltip>
            </CopyWrapper>
            <div v-else class="flex flex-col">
              <CopyWrapper :toCopy="store.processedTransaction.value.transactionData.id.hf26">
                <Tooltip>
                  <template #activator>
                    <span>HF26: {{ waxStore.shortenString(store.processedTransaction.value.transactionData.id.hf26) }}</span>
                  </template>
                  <template #content>
                    <div class="flex flex-col overflow-x-scroll">
                      <span class="text-lg">HF26 ID</span>
                      <hr class="my-2">
                      <span>{{ store.processedTransaction.value.transactionData.id.hf26 }}</span>
                    </div>
                  </template>
                </Tooltip>
              </CopyWrapper>
              <CopyWrapper :toCopy="store.processedTransaction.value.transactionData.id.legacy">
                <Tooltip>
                  <template #activator>
                    <span>Legacy: {{ waxStore.shortenString(store.processedTransaction.value.transactionData.id.legacy) }}</span>
                  </template>
                  <template #content>
                    <div class="flex flex-col overflow-x-scroll">
                      <span class="text-lg">Legacy ID</span>
                      <hr class="my-2">
                      <span>{{ store.processedTransaction.value.transactionData.id.legacy }}</span>
                    </div>
                  </template>
                </Tooltip>
              </CopyWrapper>
            </div>
          </s-table-cell>
          <s-table-cell>
            <CopyWrapper v-if="typeof store.processedTransaction.value.transactionData.sigDigest === 'string'" :toCopy="store.processedTransaction.value.transactionData.sigDigest">
              <Tooltip>
                <template #activator>
                  <span>{{ waxStore.shortenString(store.processedTransaction.value.transactionData.sigDigest) }}</span>
                </template>
                <template #content>
                  <div class="flex flex-col overflow-x-scroll">
                    <span class="text-lg">Sig Digest</span>
                    <hr class="my-2">
                    <span>{{ store.processedTransaction.value.transactionData.sigDigest }}</span>
                  </div>
                </template>
              </Tooltip>
            </CopyWrapper>
            <div v-else class="flex flex-col">
              <CopyWrapper :toCopy="store.processedTransaction.value.transactionData.sigDigest.hf26">
                <Tooltip>
                  <template #activator>
                    <span>HF26: {{ waxStore.shortenString(store.processedTransaction.value.transactionData.sigDigest.hf26) }}</span>
                  </template>
                  <template #content>
                    <div class="flex flex-col overflow-x-scroll">
                      <span class="text-lg">HF26 Sig Digest</span>
                      <hr class="my-2">
                      <span>{{ store.processedTransaction.value.transactionData.sigDigest.hf26 }}</span>
                    </div>
                  </template>
                </Tooltip>
              </CopyWrapper>
              <CopyWrapper :toCopy="store.processedTransaction.value.transactionData.sigDigest.legacy">
                <Tooltip>
                  <template #activator>
                    <span>Legacy: {{ waxStore.shortenString(store.processedTransaction.value.transactionData.sigDigest.legacy) }}</span>
                  </template>
                  <template #content>
                    <div class="flex flex-col overflow-x-scroll">
                      <span class="text-lg">Legacy Sig Digest</span>
                      <hr class="my-2">
                      <span>{{ store.processedTransaction.value.transactionData.sigDigest.legacy }}</span>
                    </div>
                  </template>
                </Tooltip>
              </CopyWrapper>
            </div>
          </s-table-cell>
          <s-table-cell>
            <span class="inline-flex flex-col">
              <span>Reference block number: <span class="font-medium">{{ store.processedTransaction.value.transactionData.tapos.refBlockNum }}</span></span>
              <hr class="my-2">
              <span>Reference block prefix: <span class="font-medium">{{ store.processedTransaction.value.transactionData.tapos.refBlockPrefix }}</span></span>
            </span>
          </s-table-cell>
          <s-table-cell class="w-80">
            <CopyWrapper :toCopy="formatted === true ? formatAndDelocalizeTime(store.processedTransaction.value.transactionData.expirationTime) : store.processedTransaction.value.transactionData.expirationTime">
              <s-tooltip-provider :delay-duration="350">
                <s-tooltip>
                  <s-tooltip-trigger as-child>
                    <span class="cursor-pointer" @click="formatted = !formatted">
                      {{ formatted === true ? formatAndDelocalizeTime(store.processedTransaction.value.transactionData.expirationTime) : store.processedTransaction.value.transactionData.expirationTime }}
                    </span>
                  </s-tooltip-trigger>
                  <s-tooltip-content>Change date format</s-tooltip-content>
                </s-tooltip>
              </s-tooltip-provider>
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
import Tooltip from './Tooltip.vue';
import { formatAndDelocalizeTime } from '#imports';

const waxStore = useWaxStore();
const store = storeToRefs(waxStore);

const formatted = ref(true);
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
