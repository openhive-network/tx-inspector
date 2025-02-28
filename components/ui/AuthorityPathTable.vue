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
                  <span class="flex items-center justify-center">
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
                      <p class="mb-2">
                        The accounts in the authority path are displayed in a specific order,
                        starting with the account owning the calculated public key <br>
                        and ending with the account specified in the transaction's required authorities.
                      </p>
                      <p>
                        <b>The authority path provides the following three details for each entry within the authority path:</b>
                      </p>
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
          <s-table-cell class="w-1/2 min-w-[300px]">
            <s-tooltip-provider v-if="'reasons' in item.graphData[index]" :delayDuration="350">
              <s-tooltip>
                <s-tooltip-trigger as-child>
                  <span
                    class="flex items-center text-red font-semibold cursor-pointer"
                    style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px; padding: 40px; margin: 0 52px;"
                  >
                    <div class="flex items-center justify-center mx-auto">
                      <span class="mr-3">{{ item.graphData[index].message }}</span>
                      <v-icon>mdi-information-slab-circle</v-icon>
                    </div>
                  </span>
                </s-tooltip-trigger>
                <s-tooltip-content class="bg-red">
                  <div class="flex flex-col">
                    <span class="text-lg font-semibold">Likely reasons:</span>
                    <hr class="my-2">
                    <ul>
                      <li v-for="(reason, key) in item.graphData[index].reasons" v-if="item.graphData[index].reasons.length > 0" :key="key" class="flex items-center font-semibold mb-2">
                        <v-icon class="mr-3">
                          mdi-alert-circle
                        </v-icon>
                        {{ reason }}
                      </li>
                      <li v-else class="flex items-center font-semibold mb-2">
                        <v-icon class="mr-3">
                          mdi-alert-circle
                        </v-icon>
                        Unknown reason occured
                      </li>
                    </ul>
                  </div>
                </s-tooltip-content>
              </s-tooltip>
            </s-tooltip-provider>
            <AuthorityTraceGraph
              v-else
              :graphData="(item.graphData[index] as IAuthorityGraphFullCollectedData).data"
              :uniqueId="index"
              :color="(item.graphData[index] as IAuthorityGraphFullCollectedData).level"
              style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px; padding: 0 10px;"
            />
          </s-table-cell>
        </s-table-row>
      </s-table-body>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
import Subtitle from './Subtitle.vue';
import CopyWrapper from './CopyWrapper.vue';
import AuthorityTraceGraph from './AuthorityTraceGraph.vue';
import { EPackType, type IAuthorityGraphFullCollectedData } from '~/types/wax';

const waxStore = useWaxStore();
const store = storeToRefs(waxStore);
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
