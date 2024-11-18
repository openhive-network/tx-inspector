<template>
  <div>
    <Subtitle class="mb-3">
      Signatures:
    </Subtitle>
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
        <s-table-row v-if="store.processedTransaction.value.expiration !== '' && store.processedTransaction.value.signatures.length === 0">
          <s-table-cell class="text-red text-center font-semibold" colspan="4">
            No signatures found
          </s-table-cell>
        </s-table-row>
        <s-table-row v-for="(signature, index) in store.processedTransaction.value.signatures" :key="index">
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
          <s-table-cell :class="store.processedTransaction.value.packType === EPackType.UNKNOWN ? 'text-red' : ''">
            {{ store.processedTransaction.value.packType }}
          </s-table-cell>
          <s-table-cell>
            <s-tooltip-provider>
              <s-tooltip>
                <s-tooltip-trigger as-child>
                  <span
                    class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
                    @click="waxStore.copy(store.processedTransaction.value.signatureKeys[index])"
                  >
                    <span>{{ `${store.processedTransaction.value.signatureKeys[index].slice(0, 5)}...${store.processedTransaction.value.signatureKeys[index].slice(-5)}` }}</span>
                    <v-icon size="md">mdi-content-copy</v-icon>
                  </span>
                </s-tooltip-trigger>
                <s-tooltip-content>
                  <div class="flex flex-col">
                    <span class="text-lg">Public key:</span>
                    <hr class="my-2">
                    <span>{{ store.processedTransaction.value.signatureKeys[index] }}</span>
                  </div>
                </s-tooltip-content>
              </s-tooltip>
            </s-tooltip-provider>
          </s-table-cell>
          <s-table-cell>
            <s-tooltip-provider v-if="store.processedTransaction.value.authorityPath.length === 1 && store.processedTransaction.value.authorityPath![0].account[0] === ''">
              <s-tooltip>
                <s-tooltip-trigger as-child>
                  <span
                    class="flex items-center text-red font-semibold cursor-pointer"
                  >
                    <span class="mr-3">Cannot find any account attached to the public key</span>
                    <v-icon>mdi-information-slab-circle</v-icon>
                  </span>
                </s-tooltip-trigger>
                <s-tooltip-content class="bg-red">
                  <div class="flex flex-col">
                    <span class="text-lg font-semibold">Potential problems:</span>
                    <hr class="my-2">
                    <ul>
                      <li class="flex items-center font-semibold mb-2">
                        <v-icon class="mr-3">
                          mdi-lightbulb-question-outline
                        </v-icon>
                        The public key has been changed after the transaction was signed.
                      </li>
                      <li class="flex items-center font-semibold mb-2">
                        <v-icon class="mr-3">
                          mdi-lightbulb-question-outline
                        </v-icon>
                        The transaction has been signed with a incorrect public key.
                      </li>
                      <li v-if="store.processedTransaction.value.packType === EPackType.UNKNOWN" class="flex items-center font-semibold mb-2">
                        <v-icon class="mr-3">
                          mdi-lightbulb-question-outline
                        </v-icon>
                        The pack type is unknown so we could not process the transaction correctly.
                      </li>
                    </ul>
                  </div>
                </s-tooltip-content>
              </s-tooltip>
            </s-tooltip-provider>
            <span v-for="(item, key) in store.processedTransaction.value.authorityPath" v-else :key="key">
              <a class="text-blue" :href="`https://explore.openhive.network/@${Array.isArray(item.account) ? item.account[index] : item.account}`">
                {{ Array.isArray(item.account) ? `@${item.account[index]}` : `@${item.account}` }}
              </a>
              {{ item.authWeight ? `(${item.authWeight.weight}/${item.authWeight.auth}) ` : '' }}
              <v-icon v-if="store.processedTransaction.value.authorityPath![key + 1]">mdi-chevron-right</v-icon>
            </span>
          </s-table-cell>
        </s-table-row>
      </s-table-body>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
import Subtitle from './Subtitle.vue';
import { EPackType } from '~/types/wax';

const waxStore = useWaxStore();
const store = storeToRefs(waxStore);
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
