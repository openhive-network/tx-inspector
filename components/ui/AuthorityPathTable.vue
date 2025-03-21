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
          <s-table-head>
            <Tooltip>
              <template #activator>
                <span class="flex items-center">
                  Signature
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </span>
              </template>
              <template #content>
                <div class="flex flex-col overflow-x-scroll">
                  <span class="text-lg">Signature</span>
                  <hr class="my-2">
                  <span>
                    The signature in hex string format generated from the public key used to sign the transaction.
                  </span>
                </div>
              </template>
            </Tooltip>
          </s-table-head>
          <s-table-head>
            <Tooltip>
              <template #activator>
                <span class="flex items-center">
                  Pack
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </span>
              </template>
              <template #content>
                <div class="flex flex-col overflow-x-scroll">
                  <span class="text-lg">Pack type</span>
                  <hr class="my-2">
                  <span>
                    The pack type determines how the transaction has been serialized. <br>
                    There are allowed two serialization forms:
                    <ul class="my-2">
                      <li><v-icon>mdi-hand-pointing-right</v-icon> Legacy (where assets have been serialized, using their token textual names i.e. "1.000000 VESTS")</li>
                      <li><v-icon>mdi-hand-pointing-right</v-icon> HF26 (where assets have been serialized, using NAI form i.e. <code>{"amount":"1000000","precision":6,"nai":"@@000000037"}</code>)</li>
                    </ul>
                  </span>
                </div>
              </template>
            </Tooltip>
          </s-table-head>
          <s-table-head>
            <Tooltip>
              <template #activator>
                <span class="flex items-center">
                  Public key
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </span>
              </template>
              <template #content>
                <div class="flex flex-col overflow-x-scroll">
                  <span class="text-lg">Public key</span>
                  <hr class="my-2">
                  <span>
                    The public key, calculated from the signature. <br>
                    This key was used to sign the transaction.
                    There are 3 types of public keys that can be used to sign a transaction:
                    <ul class="my-2">
                      <li class="text-posting"><v-icon>mdi-hand-pointing-right</v-icon> Posting</li>
                      <li class="text-active"><v-icon>mdi-hand-pointing-right</v-icon> Active</li>
                      <li class="text-owner"><v-icon>mdi-hand-pointing-right</v-icon> Owner</li>
                    </ul>
                    The signer does not have to be the same as the required authority. <br>
                    Required authority account can delegate the signing to another account, what is presented in authority path cell.
                  </span>
                </div>
              </template>
            </Tooltip>
          </s-table-head>
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
                <div class="flex flex-col overflow-x-scroll">
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
          <!-- <s-table-head class="w-[150px]">
            <Tooltip>
              <template #activator>
                <span class="flex items-center justify-center">
                  Evaluated path
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </span>
              </template>
              <template #content>
                <div class="flex flex-col overflow-x-scroll">
                  <span class="text-lg">Evaluated Path</span>
                  <hr class="my-2">
                  <span class="leading-6">
                    You can analyze other authority paths (unsuccessfull) by selecting the index from provided select input. <br>
                    In case of an error, this allows you to see the reason why the path was not successfull and what authority changes could be made to make it successfull. <br>
                    In case when one of the paths is successfull, you can analyze other paths to see what changes could be made to for example shorten the path.
                  </span>
                </div>
              </template>
            </Tooltip>
          </s-table-head> -->
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
                      <div class="flex flex-col text-wrap overflow-x-scroll">
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
                      <div class="flex flex-col overflow-x-scroll">
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
              <div class="flex justify-end">
                <AuthorityTraceGraph
                  :graphData="item.graphData.data"
                  :uniqueId="index"
                  :color="item.graphData.level"
                  class="w-[500px]"
                  style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px; padding: 0 10px; margin-right: 50px;"
                />
              </div>
            </s-table-cell>
            <s-table-cell v-else-if="'data' in item.graphData && selectIndex !== null" class="w-1/2 min-w-[300px]">
              <div class="flex justify-end">
                <AuthorityTraceGraph
                  :key="selectIndex"
                  :graphData="item.rootEntriesGraphData[selectIndex].data"
                  :uniqueId="index"
                  :color="item.rootEntriesGraphData[selectIndex].level"
                  class="w-[500px]"
                  style="border: 1.75px solid rgba(245, 40, 40, 0.5); border-radius: 4px; padding: 0 10px; margin-right: 50px;"
                />
              </div>
            </s-table-cell>
            <s-table-cell
              v-else-if="'message' in item.graphData && selectIndex === null"
              class="w-1/2 min-w-[300px]"
            >
              <div class="flex justify-end">
                <Tooltip error>
                  <template #activator>
                    <span
                      class="flex items-center text-red font-semibold cursor-pointer w-[500px]"
                      style="border: 1.75px solid rgba(245, 40, 40, 0.5); border-radius: 4px; padding: 27px; margin-right: 50px;"
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
                    <div class="flex flex-col overflow-x-scroll">
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
              </div>
            </s-table-cell>
            <s-table-cell
              v-else
              class="w-1/2 min-w-[300px]"
            >
              <div class="flex justify-end">
                <AuthorityTraceGraph
                  :key="selectIndex!"
                  :graphData="item.rootEntriesGraphData[selectIndex!].data"
                  :uniqueId="index"
                  :color="item.rootEntriesGraphData[selectIndex!].level"
                  class="w-[500px]"
                  style="border: 1.75px solid rgba(245, 40, 40, 0.5); border-radius: 4px; padding: 0 10px; margin-right: 50px;"
                />
              </div>
            </s-table-cell>
          </template>
          <!-- <s-table-cell>
            <s-select v-model="selectIndex">
              <s-select-trigger class="w-[150px]" style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px;">
                <s-select-value placeholder="Select path" />
              </s-select-trigger>
              <s-select-content class="bg-[#000] text-[#fff]">
                <s-select-group style="border: 1.75px solid rgba(255, 255, 255, .5); border-radius: 4px;">
                  <s-select-label>Path index</s-select-label>
                  <s-select-item v-if="'message' in item.graphData" :value="null">
                    Error info
                  </s-select-item>
                  <s-select-item v-if="'data' in item.graphData" :value="null">
                    Effective path
                  </s-select-item>
                  <s-select-item v-for="(_data, key) in item.rootEntriesGraphData" :key="key" :value="key">
                    {{ key + 1 }}
                  </s-select-item>
                </s-select-group>
              </s-select-content>
            </s-select>
          </s-table-cell> -->
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
