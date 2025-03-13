<template>
  <div class="flex flex-col gap-3 w-full">
    <Subtitle class="mb-3">
      Body:
    </Subtitle>
    <div class="flex">
      <s-radio-group v-if="store.processedTransaction.value.transactionBodyData.length !== 0" v-model="radioState" default-value="formatted" class="flex flex-col md:flex-row gap-6">
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="formatted-body" value="formatted" />
          <s-label for="formatted-body">
            Formatted
          </s-label>
        </div>
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="json-body" value="json" />
          <s-label for="json-body">
            JSON
          </s-label>
        </div>
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="binary-body" value="binary" />
          <s-tooltip-provider :delayDuration="350">
            <s-tooltip>
              <s-tooltip-trigger as-child>
                <s-label for="binary-body" class="inline-flex items-center">
                  <span>Binary</span>
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </s-label>
              </s-tooltip-trigger>
              <s-tooltip-content>
                <div class="flex flex-col">
                  <span class="text-lg">Binary format</span>
                  <hr class="my-2">
                  <span class="leading-6">
                    <b>The binary view displays transaction in hexadecimal format. You can:</b>
                    <ul class="mt-2">
                      <li> <v-icon>mdi-hand-pointing-right</v-icon> Select and copy a specific hex or binary (ANSI) values.</li>
                      <li class="mt-1"> <v-icon>mdi-hand-pointing-right</v-icon> Hover over hex ranges to highlight its representation within JSON structure for easier and faster analysis.</li>
                    </ul><br>
                    <b>Some transactions (containing assets) are serialization sensitive:</b>
                    <ul class="mt-2">
                      <li> <v-icon>mdi-hand-pointing-right</v-icon> The binary format as well as JSON will differ based on the pack type.</li>
                      <li class="my-1"> <v-icon>mdi-hand-pointing-right</v-icon> Choose the variant to show: <b>HF26</b> or <b>Legacy</b>.</li>
                      <li v-if="store.processedTransaction.value.signatureData[0].rows[0].packType === EPackType.UNKNOWN">
                        <v-icon>mdi-hand-pointing-right</v-icon> Due to <b>unknown pack</b> type, the <b>HF26</b> variant is selected by default.
                      </li>
                      <li v-else> <v-icon>mdi-hand-pointing-right</v-icon> By default, the pack type deduced from the transaction analysis is selected.</li>
                    </ul>
                  </span>
                </div>
              </s-tooltip-content>
            </s-tooltip>
          </s-tooltip-provider>
        </div>
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="operation-binary" value="operation-binary" />
          <s-tooltip-provider :delayDuration="350">
            <s-tooltip>
              <s-tooltip-trigger as-child>
                <s-label for="operation-binary" class="inline-flex items-center">
                  <span>Operation Binary</span>
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </s-label>
              </s-tooltip-trigger>
              <s-tooltip-content>
                <div class="flex flex-col">
                  <span class="text-lg">Operation binary format</span>
                  <hr class="my-2">
                  <span class="leading-6">
                    <b>The operation binary view displays operations in hexadecimal format. You can:</b>
                    <ul class="mt-2">
                      <li> <v-icon>mdi-hand-pointing-right</v-icon> Select and copy a specific hex or binary (ANSI) values.</li>
                      <li class="mt-1"> <v-icon>mdi-hand-pointing-right</v-icon> Hover over hex ranges to highlight its representation within JSON structure for easier and faster analysis.</li>
                    </ul><br>
                    <b>Some operations (containing assets) are serialization sensitive:</b>
                    <ul class="mt-2">
                      <li> <v-icon>mdi-hand-pointing-right</v-icon> The binary format as well as JSON will differ based on the pack type.</li>
                      <li class="my-1"> <v-icon>mdi-hand-pointing-right</v-icon> Choose the variant to show: <b>HF26</b> or <b>Legacy</b>.</li>
                      <li v-if="store.processedTransaction.value.signatureData[0].rows[0].packType === EPackType.UNKNOWN">
                        <v-icon>mdi-hand-pointing-right</v-icon> Due to <b>unknown pack</b> type, the <b>HF26</b> variant is selected by default.
                      </li>
                      <li v-else> <v-icon>mdi-hand-pointing-right</v-icon> By default, the pack type deduced from the transaction analysis is selected.</li>
                    </ul>
                  </span>
                </div>
              </s-tooltip-content>
            </s-tooltip>
          </s-tooltip-provider>
        </div>
      </s-radio-group>
      <s-radio-group v-if="radioState === 'binary' || radioState === 'operation-binary'" v-model="binaryRadioState" class="ml-4 pl-4 flex gap-6 border-l-2">
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="hf26-binary" value="hf26-binary" />
          <s-label for="hf26-binary">
            HF26
          </s-label>
        </div>
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="legacy-binary" value="legacy-binary" />
          <s-label for="legacy-binary">
            Legacy
          </s-label>
        </div>
      </s-radio-group>
    </div>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <div v-else>
      <div v-if="radioState === 'binary' || radioState === 'operation-binary'" class="text-gray-200 px-6 py-3 my-6 border-l-4">
        <p class="text-sm">
          You can see {{ radioState === 'binary' ? 'transaction' : 'operation' }} binary form displayed as hex byte values.
          You can select whole fields or binary buffer ranges to copy contents from it.
        </p>
      </div>
      <BinaryView
        v-if="store.binaryViewOutputData.value"
        v-show="radioState === 'binary' && binaryRadioState === 'hf26-binary'"
        :data="store.binaryViewOutputData.value"
        dark
        @copy="toast.success('Copied selected range to clipboard')"
      />
      <BinaryView
        v-if="store.binaryViewOutputData.value"
        v-show="radioState === 'binary' && binaryRadioState === 'legacy-binary'"
        :data="store.legacyBinaryViewOutputData.value"
        dark
        @copy="toast.success('Copied selected range to clipboard')"
      />
      <div v-for="(item, index) in store.processedTransaction.value.transactionBodyData" :key="index">
        <div v-show="radioState === 'operation-binary'">
          <BinaryView
            v-show="binaryRadioState === 'hf26-binary'"
            :data="item.operationsBinaryView"
            rootnode="operation"
            dark
          />
          <BinaryView
            v-show="binaryRadioState === 'legacy-binary'"
            :data="item.operationsLegacyBinaryView"
            rootnode="operation"
            dark
          />
          <s-separator v-if="store.processedTransaction.value.transactionBodyData[index + 1]" class="my-8" />
        </div>
      </div>
      <s-table v-if="radioState !== 'binary' && radioState !== 'operation-binary'">
        <s-table-header>
          <s-table-row>
            <s-table-head>Authority account</s-table-head>
            <s-table-head>Authority type</s-table-head>
            <s-table-head>Satisfied</s-table-head>
            <s-table-head>Operation type</s-table-head>
            <s-table-head>Operation content</s-table-head>
          </s-table-row>
        </s-table-header>
        <s-table-body v-show="radioState === 'formatted'">
          <s-table-row v-for="(item, index) in store.processedTransaction.value.transactionBodyData" :key="index">
            <s-table-cell>
              <p v-if="item.authorityAccount === 'None'" class="text-red font-semibold">
                {{ item.authorityAccount }}
              </p>
              <CopyWrapper v-else :toCopy="(item.authorityAccount as string)">
                <a class="my-2 text-blue hover:opacity-70 transition-opacity" :href="`${config.public.blockExplorerUrl}/@${item.authorityAccount}`" target="_blank">
                  {{ `@${item.authorityAccount}` }}
                </a>
              </CopyWrapper>
            </s-table-cell>
            <s-table-cell>
              <span
                :class="{
                  'text-posting': item.authorityType === 'Posting',
                  'text-active': item.authorityType === 'Active',
                  'text-owner': item.authorityType === 'Owner',
                  'opacity-80': item.authorityType === 'Other' }"
              >
                {{ item.authorityType }}
              </span>
            </s-table-cell>
            <s-table-cell class="p-5">
              <v-icon v-if="item.isSatisfied[index] === ESatisfiedState.TRUE" color="green">
                mdi-check
              </v-icon>
              <v-icon v-else-if="item.isSatisfied[index] === ESatisfiedState.FALSE" color="red">
                mdi-close
              </v-icon>
              <s-tooltip-provider v-else-if="item.isSatisfied[index] === ESatisfiedState.BLOCKCHAIN_FORCED_TRUE" :delayDuration="350">
                <s-tooltip>
                  <s-tooltip-trigger as-child>
                    <v-icon color="yellow">
                      mdi-alert-circle-check-outline
                    </v-icon>
                  </s-tooltip-trigger>
                  <s-tooltip-content>
                    <div class="flex flex-col">
                      <span class="text-lg">Blockchain Forced True</span>
                      <hr class="my-2">
                      <span class="leading-6">
                        The application cannot deduce the satisfied state correctly due to a missing signature of the required authority. <br>
                        Anyway we assume that the required authority is satisfied because the transaction originates from the chain and processed entry matches the required authority. <br>
                        This can happen when accout's authority has been changed after the transaction was signed.
                      </span>
                    </div>
                  </s-tooltip-content>
                </s-tooltip>
              </s-tooltip-provider>
            </s-table-cell>
            <s-table-cell>
              <span>{{ item.operationType }}</span>
            </s-table-cell>
            <s-table-cell class="max-w-[30vw]">
              <component :is="store.formattedOperations.value[index].value.message ?? store.formattedOperations.value[index].value" />
            </s-table-cell>
          </s-table-row>
        </s-table-body>
        <s-table-body v-show="radioState === 'json'">
          <s-table-row v-for="(item, index) in store.processedTransaction.value.transactionBodyData" :key="index">
            <s-table-cell>
              <p v-if="item.authorityAccount === 'None'" class="text-red font-semibold">
                {{ item.authorityAccount }}
              </p>
              <CopyWrapper v-else :toCopy="(item.authorityAccount as string)">
                <a class="my-2 text-blue hover:opacity-70 transition-opacity" :href="`${config.public.blockExplorerUrl}/@${item.authorityAccount}`" target="_blank">
                  {{ `@${item.authorityAccount}` }}
                </a>
              </CopyWrapper>
            </s-table-cell>
            <s-table-cell>
              <span
                :class="{
                  'text-posting': item.authorityType === 'Posting',
                  'text-active': item.authorityType === 'Active',
                  'text-owner': item.authorityType === 'Owner',
                  'opacity-80': item.authorityType === 'Other' }"
              >
                {{ item.authorityType }}
              </span>
            </s-table-cell>
            <s-table-cell class="p-5">
              <v-icon v-if="item.isSatisfied[index] === ESatisfiedState.TRUE" color="green">
                mdi-check
              </v-icon>
              <v-icon v-else-if="item.isSatisfied[index] === ESatisfiedState.FALSE" color="red">
                mdi-close
              </v-icon>
              <s-tooltip-provider v-else-if="item.isSatisfied[index] === ESatisfiedState.BLOCKCHAIN_FORCED_TRUE" :delayDuration="350">
                <s-tooltip>
                  <s-tooltip-trigger as-child>
                    <v-icon color="yellow">
                      mdi-alert-circle-check-outline
                    </v-icon>
                  </s-tooltip-trigger>
                  <s-tooltip-content>
                    <div class="flex flex-col">
                      <span class="text-lg">Blockchain Forced True</span>
                      <hr class="my-2">
                      <span class="leading-6">
                        The application cannot deduce the satisfied state correctly due to a missing signature of the required authority. <br>
                        Anyway we assume that the required authority is satisfied because the transaction originates from the chain and processed entry matches the required authority. <br>
                        This can happen when accout's authority has been changed after the transaction was signed.
                      </span>
                    </div>
                  </s-tooltip-content>
                </s-tooltip>
              </s-tooltip-provider>
            </s-table-cell>
            <s-table-cell>
              <span>{{ item.operationType }}</span>
            </s-table-cell>
            <s-table-cell class="flex flex-col items-center gap-4 max-w-[30vw]">
              <CopyWrapper :toCopy="JSON.stringify(item.operationContent)">
                <code>
                  {{ (JSON.stringify(item.operationContent, null, 2).length > 600 && expanded === false) ? `${JSON.stringify(item.operationContent, null, 2).slice(0, 600)}...` : JSON.stringify(item.operationContent, null, 2) }}
                </code>
              </CopyWrapper>
              <s-separator
                v-if="JSON.stringify(item.operationContent, null, 2).length > 600"
                :label="expanded ? 'Collapse JSON' : 'Expand JSON'"
                decorative
                class="cursor-pointer mb-1 w-60"
                @click="expanded = !expanded"
              />
            </s-table-cell>
          </s-table-row>
        </s-table-body>
      </s-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toast } from 'vue-sonner';
import Subtitle from './Subtitle.vue';
import CopyWrapper from './CopyWrapper.vue';
import { EPackType, ESatisfiedState } from '~/types/wax';

const wax = useWaxStore();
const store = storeToRefs(wax);

const config = useRuntimeConfig();

const radioState = ref('formatted');

const binaryRadioState = ref('hf26-binary');

const expanded = ref(false);

watch(() => wax.$state.defaultBinaryRadioState, (newValue) => {
  binaryRadioState.value = newValue;
});
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>

<style>
@media (max-width: 768px) {
  .binary-view-container {
    display: flex;
    flex-direction: column;
    margin-top: 4rem;
    gap: 1rem;
  }

  .binary-view-left-pane-hex-data {
    max-width: 70% !important;
  }
}
</style>
