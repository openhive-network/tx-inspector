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
          <s-table-head>
            <s-tooltip-provider :delayDuration="350">
              <s-tooltip>
                <s-tooltip-trigger as-child>
                  <span class="flex items-center">
                    Authority path
                    <v-icon size="small" class="ml-2">
                      mdi-information-slab-circle-outline
                    </v-icon>
                  </span>
                </s-tooltip-trigger>
                <s-tooltip-content>
                  <div class="flex flex-col">
                    <span class="text-lg">Authority Path</span>
                    <hr class="my-2">
                    <span class="leading-6">
                      <b>The authority path provides three details for each level within the authority nest:</b>
                      <ul class="mt-2">
                        <li class="mt-1"> <v-icon>mdi-hand-pointing-right</v-icon> Account name, which links to more detailed account information.</li>
                        <li> <v-icon>mdi-hand-pointing-right</v-icon> (Weight/Threshold).</li>
                        <li>
                          <v-icon>mdi-hand-pointing-right</v-icon>
                          The authority level, indicated by the text color of the account name - <span class="text-posting">Posting</span>, <span class="text-active">Active</span>, <span class="text-owner">Owner</span>.
                        </li>
                      </ul>
                    </span>
                  </div>
                </s-tooltip-content>
              </s-tooltip>
            </s-tooltip-provider>
          </s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row v-if="store.processedTransaction.value.transactionData.expirationTime !== '' && store.processedTransaction.value.signatureData.length === 0">
          <s-table-cell class="text-red text-center font-semibold" colspan="4">
            No signatures found
          </s-table-cell>
        </s-table-row>
        <s-table-row v-for="(item, index) in store.processedTransaction.value.signatureData" :key="index">
          <s-table-cell>
            <CopyWrapper :toCopy="item.signature">
              <s-tooltip-provider :delayDuration="350">
                <s-tooltip>
                  <s-tooltip-trigger as-child>
                    <span>{{ waxStore.shortenString(item.signature) }}</span>
                  </s-tooltip-trigger>
                  <s-tooltip-content>
                    <div class="flex flex-col">
                      <span class="text-lg">Signature:</span>
                      <hr class="my-2">
                      <span>{{ item.signature }}</span>
                    </div>
                  </s-tooltip-content>
                </s-tooltip>
              </s-tooltip-provider>
            </CopyWrapper>
          </s-table-cell>
          <s-table-cell
            :class="{
              'text-red capitalize font-semibold': item.packType === EPackType.UNKNOWN,
              'capitalize': item.packType === EPackType.LEGACY,
              'uppercase': item.packType === EPackType.HF26,
            }"
          >
            {{ item.packType }}
          </s-table-cell>
          <s-table-cell>
            <CopyWrapper :toCopy="item.publicKey">
              <s-tooltip-provider :delayDuration="350">
                <s-tooltip>
                  <s-tooltip-trigger as-child>
                    <span>{{ waxStore.shortenString(item.publicKey) }}</span>
                  </s-tooltip-trigger>
                  <s-tooltip-content>
                    <div class="flex flex-col">
                      <span class="text-lg">Public key:</span>
                      <hr class="my-2">
                      <span>{{ item.publicKey }}</span>
                    </div>
                  </s-tooltip-content>
                </s-tooltip>
              </s-tooltip-provider>
            </CopyWrapper>
          </s-table-cell>
          <s-table-cell>
            <s-tooltip-provider v-if="!item.authorityPath || typeof item.authorityPath[0] === 'undefined' || item.authorityPath[0].account[0] === ''" :delayDuration="350">
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
                      <li v-if="item.packType === EPackType.UNKNOWN" class="flex items-center font-semibold mb-2">
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
            <!-- <span v-for="(pathItem, key) in item.authorityPath" v-else :key="key">
              <a class="text-blue" :href="`${config.public.blockExplorerUrl}/@${Array.isArray(pathItem.account) ? pathItem.account[index] : pathItem.account}`" target="_blank">
                {{ Array.isArray(pathItem.account) ? `@${pathItem.account[index]}` : `@${pathItem.account}` }}
              </a>
              {{ pathItem.authWeight ? `(${pathItem.authWeight.weight}/${pathItem.authWeight.auth}) ` : '' }}
              <v-icon v-if="item.authorityPath[key + 1]">mdi-chevron-right</v-icon>
            </span> -->
            <span v-for="(pathItem, key) in item.authorityTrace.finalAuthorityPath.slice().reverse()" :key="key">
              <a
                :href="`${config.public.blockExplorerUrl}/@${pathItem.processedEntry}`"
                :class="[
                  {
                    'text-posting': pathItem.processedRole === 'posting',
                    'text-active': pathItem.processedRole === 'active',
                    'text-owner': pathItem.processedRole === 'owner',
                  },
                  'hover:opacity-70 transition-opacity'
                ]"
              >
                {{ `@${pathItem.processedEntry}` }}
              </a>
              <span v-if="item.authorityTrace.finalAuthorityPath[key + 1]" class="ml-1">{{ `(${pathItem.weight}/${pathItem.threshold})` }}</span>
              <v-icon v-if="item.authorityTrace.finalAuthorityPath[key + 1]">mdi-chevron-right</v-icon>
            </span>
          </s-table-cell>
        </s-table-row>
      </s-table-body>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
import Subtitle from './Subtitle.vue';
import CopyWrapper from './CopyWrapper.vue';
import { EPackType } from '~/types/wax';

const waxStore = useWaxStore();
const store = storeToRefs(waxStore);

const config = useRuntimeConfig();
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
