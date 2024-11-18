<template>
  <div>
    <Subtitle class="mb-3">
      Required Authorities:
    </Subtitle>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <s-table v-else>
      <s-table-header>
        <s-table-row>
          <s-table-head>Matching signature</s-table-head>
          <s-table-head>Authority accounts</s-table-head>
          <s-table-head>Authority type</s-table-head>
          <s-table-head>Satisfied</s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row
          v-for="(item, index) in store.processedTransaction.value.requiredAuthoritiesData"
          :key="index"
        >
          <s-table-cell>
            <s-tooltip-provider :disabled="item.matchingSignature.length < 30">
              <s-tooltip>
                <s-tooltip-trigger as-child>
                  <span
                    class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
                    @click="waxStore.copy(item.matchingSignature)"
                  >
                    <span
                      :class="{
                        'text-yellow': item.matchingSignature === 'Open authority',
                        'text-red font-semibold': item.matchingSignature === 'Missing signature',
                      }"
                    >
                      {{ waxStore.shortenString(item.matchingSignature) }}
                    </span>
                    <v-icon v-if="item.matchingSignature.length > 30" size="md">mdi-content-copy</v-icon>
                  </span>
                </s-tooltip-trigger>
                <s-tooltip-content>
                  <div class="flex flex-col">
                    <span class="text-lg">Signature:</span>
                    <hr class="my-2">
                    <span>{{ item.matchingSignature }}</span>
                  </div>
                </s-tooltip-content>
              </s-tooltip>
            </s-tooltip-provider>
          </s-table-cell>
          <s-table-cell>
            <span class="flex flex-col">
              <a class="my-2 text-blue" :href="`${config.public.blockExplorerUrl}/@${item.authorityAccount}`">
                {{ `@${item.authorityAccount}` }}
              </a>
            </span>
          </s-table-cell>
          <s-table-cell class="p-5">
            <span
              :class="{
                'text-green': item.authorityType === 'Posting',
                'text-blue': item.authorityType === 'Active',
                'text-orange': item.authorityType === 'Owner',
                'text-yellow': item.authorityType === 'Other' }"
            >
              {{ item.authorityType }}
            </span>
          </s-table-cell>
          <s-table-cell class="p-5">
            <v-icon :color="item.isSatisfied ? 'green' : 'red'">
              {{ item.isSatisfied ? 'mdi-check' : 'mdi-close' }}
            </v-icon>
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

const config = useRuntimeConfig();
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
