<template>
  <div>
    <Subtitle class="mb-3">
      Signatures:
    </Subtitle>
    <s-skeleton
      v-if="store.isLoading.value"
      class="w-full h-[100px] skeleton"
    />
    <s-table v-else>
      <s-table-header>
        <s-table-row>
          <s-table-head>Signature</s-table-head>
          <s-table-head>Pack</s-table-head>
          <s-table-head>Public key</s-table-head>
          <s-table-head>
            <Tooltip>
              <template #activator>
                <span class="flex items-center justify-center">
                  Authority path
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </span>
              </template>
              <template #content>
                <div class="flex flex-col">
                  <span class="text-lg">Authority Path</span>
                  <hr class="my-2">
                  <span class="leading-6">
                    <p class="mb-2">
                      The accounts in the authority path are displayed in a
                      specific order, starting with the account owning the
                      calculated public key <br>
                      and ending with the account specified in the
                      transaction's required authorities.
                    </p>
                    <p>
                      <b>The authority path provides the following three
                        details for each entry within the authority path:</b>
                    </p>
                    <ul class="mt-2">
                      <li class="mt-1">
                        <v-icon>mdi-hand-pointing-right</v-icon>
                        Account name, which links to more detailed account
                        information.
                      </li>
                      <li>
                        <v-icon>mdi-hand-pointing-right</v-icon>
                        (Weight/Threshold).
                      </li>
                      <li>
                        <v-icon>mdi-hand-pointing-right</v-icon>
                        The authority level, indicated by the text color of the
                        account name -
                        <span class="text-posting">Posting</span>,
                        <span class="text-active">Active</span>,
                        <span class="text-owner">Owner</span>.
                      </li>
                    </ul>
                  </span>
                </div>
              </template>
            </Tooltip>
          </s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row v-if="store.processedTransaction.value.transactionData.expirationTime !== '' && store.processedTransaction.value.signatureData.length === 0">
          <s-table-cell
            class="text-red text-center font-semibold"
            colspan="4"
          >
            No signatures found
          </s-table-cell>
        </s-table-row>
        <s-table-row
          v-for="(item, index) in store.processedTransaction.value.signatureData"
          :key="index"
        >
          <s-table-cell>
            <div class="flex flex-col">
              <span v-for="({ signature }, sigKey) in item.rows" :key="sigKey">
                <CopyWrapper :toCopy="signature">
                  <Tooltip>
                    <template #activator>
                      <span>
                        {{ waxStore.shortenString(signature) }}
                      </span>
                    </template>
                    <template #content>
                      <div class="flex flex-col">
                        <span class="text-lg">Signature:</span>
                        <hr class="my-2">
                        <span>{{ signature }}</span>
                      </div>
                    </template>
                  </Tooltip>
                </CopyWrapper>
              </span>
            </div>
          </s-table-cell>
          <s-table-cell
            :class="{
              'text-red capitalize font-semibold':
                item.rows[0].packType === EPackType.UNKNOWN,
              capitalize: item.rows[0].packType === EPackType.LEGACY,
              uppercase: item.rows[0].packType === EPackType.HF26,
            }"
          >
            {{ item.rows[0].packType }}
          </s-table-cell>
          <s-table-cell>
            <div class="flex flex-col">
              <span v-for="({ publicKey }, publickKeyIndex) in item.rows" :key="publickKeyIndex">
                <CopyWrapper :toCopy="publicKey" class="inline">
                  <Tooltip>
                    <template #activator>
                      <span>
                        {{ waxStore.shortenString(publicKey) }}
                      </span>
                    </template>
                    <template #content>
                      <div class="flex flex-col">
                        <span class="text-lg">Public key:</span>
                        <hr class="my-2">
                        <span>{{ publicKey }}</span>
                      </div>
                    </template>
                  </Tooltip>
                </CopyWrapper>
              </span>
            </div>
          </s-table-cell>
          <template v-if="item.graphData">
            <s-table-cell
              v-if="'data' in item.graphData && selectIndex === null"
              class="w-1/2 min-w-[300px]"
            >
              <div class="flex justify-between">
                <AuthorityTraceGraph
                  :graphData="item.graphData.data"
                  :uniqueId="index"
                  :color="item.graphData.level"
                  class="w-[500px]"
                  style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px; padding: 0 10px; margin-right: 52px;"
                />
                <s-select v-model="selectIndex">
                  <s-select-trigger class="w-[150px]" style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px;">
                    <s-select-value placeholder="Select path" />
                  </s-select-trigger>
                  <s-select-content class="bg-[#000] text-[#fff]">
                    <s-select-group style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px;">
                      <s-select-label>Path index</s-select-label>
                      <s-select-item v-for="(_data, key) in item.rootEntriesGraphData" :key="key" :value="key">
                        {{ key + 1 }}
                      </s-select-item>
                    </s-select-group>
                  </s-select-content>
                </s-select>
              </div>
            </s-table-cell>
            <s-table-cell v-else-if="'data' in item.graphData && selectIndex !== null" class="w-1/2 min-w-[300px]">
              <div class="flex justify-between">
                <AuthorityTraceGraph
                  :key="selectIndex"
                  :graphData="item.rootEntriesGraphData[selectIndex].data"
                  :uniqueId="index"
                  :color="item.rootEntriesGraphData[selectIndex].level"
                  class="w-[500px]"
                  style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px; padding: 0 10px; margin-right: 52px;"
                />
                <s-select v-model="selectIndex">
                  <s-select-trigger class="w-[150px]" style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px;">
                    <s-select-value placeholder="Select path" />
                  </s-select-trigger>
                  <s-select-content class="bg-[#000] text-[#fff]">
                    <s-select-group style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px;">
                      <s-select-label>Path index</s-select-label>
                      <s-select-item :value="null">
                        Successfull path
                      </s-select-item>
                      <s-select-item v-for="(_data, key) in item.rootEntriesGraphData" :key="key" :value="key">
                        {{ key + 1 }}
                      </s-select-item>
                    </s-select-group>
                  </s-select-content>
                </s-select>
              </div>
            </s-table-cell>
            <s-table-cell
              v-else-if="'message' in item.graphData && selectIndex === null"
              class="w-1/2 min-w-[300px]"
            >
              <div class="flex justify-between">
                <Tooltip error>
                  <template #activator>
                    <span
                      class="flex items-center text-red font-semibold cursor-pointer w-[500px]"
                      style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px; padding: 27px; margin-right: 52px;"
                    >
                      <div class="flex items-center justify-center mx-auto">
                        <span class="mr-3">
                          {{ item.graphData.message }}
                        </span>
                        <v-icon>mdi-information-slab-circle</v-icon>
                      </div>
                    </span>
                  </template>
                  <template #content>
                    <div class="flex flex-col">
                      <span class="text-lg font-semibold">Likely reasons:</span>
                      <hr class="my-2">
                      <ul>
                        <li
                          v-for="(reason, key) in item.graphData.reasons"
                          v-if="item.graphData.reasons.length > 0"
                          :key="key"
                          class="flex items-center font-semibold mb-2"
                        >
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
                  </template>
                </Tooltip>
                <s-select v-model="selectIndex">
                  <s-select-trigger class="w-[150px]" style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px;">
                    <s-select-value placeholder="Select path" />
                  </s-select-trigger>
                  <s-select-content class="bg-[#000] text-[#fff]">
                    <s-select-group style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px;">
                      <s-select-label>Path index</s-select-label>
                      <s-select-item v-for="(_data, key) in item.rootEntriesGraphData" :key="key" :value="key">
                        {{ key + 1 }}
                      </s-select-item>
                    </s-select-group>
                  </s-select-content>
                </s-select>
              </div>
            </s-table-cell>
            <s-table-cell
              v-else
              class="w-1/2 min-w-[300px]"
            >
              <div class="flex justify-between">
                <AuthorityTraceGraph
                  :key="selectIndex!"
                  :graphData="item.rootEntriesGraphData[selectIndex!].data"
                  :uniqueId="index"
                  :color="item.rootEntriesGraphData[selectIndex!].level"
                  class="w-[500px]"
                  style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px; padding: 0 10px; margin-right: 52px;"
                />
                <s-select v-model="selectIndex">
                  <s-select-trigger class="w-[150px]" style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px;">
                    <s-select-value placeholder="Select path" />
                  </s-select-trigger>
                  <s-select-content class="bg-[#000] text-[#fff]">
                    <s-select-group style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px;">
                      <s-select-label>Path index</s-select-label>
                      <s-select-item :value="null">
                        Error info
                      </s-select-item>
                      <s-select-item v-for="(_data, key) in item.rootEntriesGraphData" :key="key" :value="key">
                        {{ key + 1 }}
                      </s-select-item>
                    </s-select-group>
                  </s-select-content>
                </s-select>
              </div>
            </s-table-cell>
          </template>
        </s-table-row>
      </s-table-body>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
import Subtitle from './Subtitle.vue';
import CopyWrapper from './CopyWrapper.vue';
import AuthorityTraceGraph from './AuthorityTraceGraph.vue';
import Tooltip from './Tooltip.vue';
import { EPackType } from '~/types/wax';

const waxStore = useWaxStore();
const store = storeToRefs(waxStore);

const selectIndex = ref<number | null>(null);
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
