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
            <s-tooltip-provider :disabled="item.matchingSignature.length < 30" :delayDuration="350">
              <s-tooltip>
                <s-tooltip-trigger as-child>
                  <CopyWrapper :toCopy="item.matchingSignature">
                    {{ waxStore.shortenString(item.matchingSignature) }}
                  </CopyWrapper>
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
            <span class="inline-flex flex-col">
              <p v-if="item.authorityAccount === 'None'" class="my-2 text-red font-semibold">
                {{ item.authorityAccount }}
              </p>
              <CopyWrapper v-else :toCopy="(item.authorityAccount as string)">
                <a class="my-2 text-blue" :href="`${config.public.blockExplorerUrl}/@${item.authorityAccount}`" target="_blank">
                  {{ `@${item.authorityAccount}` }}
                </a>
              </CopyWrapper>
            </span>
          </s-table-cell>
          <s-table-cell class="p-5">
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
          <s-table-cell class="p-5">
            <v-icon v-if="item.isSatisfied === ESatisfiedState.TRUE" color="green">
              mdi-check
            </v-icon>
            <v-icon v-else-if="item.isSatisfied === ESatisfiedState.FALSE" color="red">
              mdi-close
            </v-icon>
            <s-tooltip-provider v-else-if="item.isSatisfied === ESatisfiedState.BLOCKCHAIN_FORCED_TRUE" :delayDuration="350">
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
                      The application cannot deduce the satisfied state correctly due to a missing signature or the lack of a matching account for the public key, <br>
                      but the transaction is valid and originates from the chain, so we assume that the required authority is satisfied.
                    </span>
                  </div>
                </s-tooltip-content>
              </s-tooltip>
            </s-tooltip-provider>
          </s-table-cell>
        </s-table-row>
      </s-table-body>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
import Subtitle from './Subtitle.vue';
import CopyWrapper from './CopyWrapper.vue';
import { ESatisfiedState } from '~/types/wax';

const waxStore = useWaxStore();
const store = storeToRefs(waxStore);

const config = useRuntimeConfig();
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
