<template>
  <div class="flex flex-col gap-3 w-full">
    <Subtitle class="mb-3">
      Body:
    </Subtitle>
    <s-radio-group v-if="store.processedTransaction.value.transactionBodyData.length !== 0" v-model="radioState" default-value="formatted" class="flex gap-6">
      <div class="flex items-center space-x-2">
        <s-radio-group-item id="formatted" value="formatted" />
        <s-label for="formatted">
          Formatted
        </s-label>
      </div>
      <div class="flex items-center space-x-2">
        <s-radio-group-item id="json" value="json" />
        <s-label for="json">
          JSON
        </s-label>
      </div>
      <div class="flex items-center space-x-2">
        <s-radio-group-item id="binary" value="binary" />
        <s-label for="binary">
          Binary
        </s-label>
      </div>
    </s-radio-group>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <div v-else>
      <BinaryView
        v-if="store.binaryViewOutputData.value"
        v-show="radioState === 'binary'"
        :data="store.binaryViewOutputData.value"
        dark
        class="mb-16"
        @copy="toast.success('Copied selected range to clipboard')"
      />
      <s-table v-if="radioState !== 'binary'">
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
              <a v-else class="text-blue" :href="`${config.public.blockExplorerUrl}/@${item.authorityAccount}`">
                {{ `@${item.authorityAccount}` }}
              </a>
            </s-table-cell>
            <s-table-cell>
              <span
                :class="{
                  'text-green': item.authorityType === 'Posting',
                  'text-blue': item.authorityType === 'Active',
                  'text-orange': item.authorityType === 'Owner',
                  'opacity-80': item.authorityType === 'Other' }"
              >
                {{ item.authorityType }}
              </span>
            </s-table-cell>
            <s-table-cell>
              <v-icon v-if="item.isSatisfied === ESatisfiedState.TRUE" color="green">
                mdi-check
              </v-icon>
              <v-icon v-else-if="item.isSatisfied === ESatisfiedState.FALSE" color="red">
                mdi-close
              </v-icon>
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
              <a v-else class="text-blue" :href="`${config.public.blockExplorerUrl}/@${item.authorityAccount}`">
                {{ `@${item.authorityAccount}` }}
              </a>
            </s-table-cell>
            <s-table-cell>
              <span
                :class="{
                  'text-green': item.authorityType === 'Posting',
                  'text-blue': item.authorityType === 'Active',
                  'text-orange': item.authorityType === 'Owner',
                  'opacity-80': item.authorityType === 'Other' }"
              >
                {{ item.authorityType }}
              </span>
            </s-table-cell>
            <s-table-cell>
              <v-icon v-if="item.isSatisfied === ESatisfiedState.TRUE" color="green">
                mdi-check
              </v-icon>
              <v-icon v-else-if="item.isSatisfied === ESatisfiedState.FALSE" color="red">
                mdi-close
              </v-icon>
            </s-table-cell>
            <s-table-cell>
              <span>{{ item.operationType }}</span>
            </s-table-cell>
            <s-table-cell class="max-w-[30vw]">
              <code>
                {{ JSON.stringify(item.operationContent, null, 2) }}
              </code>
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
import { ESatisfiedState } from '~/types/wax';

const wax = useWaxStore();
const store = storeToRefs(wax);

const config = useRuntimeConfig();

const radioState = ref('formatted');
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
