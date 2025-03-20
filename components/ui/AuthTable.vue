<template>
  <div>
    <Subtitle class="mb-3">
      Required Authorities:
    </Subtitle>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <s-table v-else>
      <s-table-header>
        <s-table-row>
          <s-table-head>
            <Tooltip>
              <template #activator>
                <span class="flex items-center">
                  Matching signature
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </span>
              </template>
              <template #content>
                <div class="flex flex-col">
                  <span class="text-lg">Matching signature</span>
                  <hr class="my-2">
                  <span>
                    Matching signature is a signature that corresponds to the transaction required authority. <br>
                    It means that this signature is attachted to the required authority, <b>but it does not mean that this account signed the transaction.</b><br>
                    The signer can differ from the required authority when required authority account delegated the signing permission to another account. <br>
                  </span>
                </div>
              </template>
            </Tooltip>
          </s-table-head>
          <s-table-head>
            <Tooltip>
              <template #activator>
                <span class="flex items-center">
                  Authority account
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </span>
              </template>
              <template #content>
                <div class="flex flex-col">
                  <span class="text-lg">Authority account</span>
                  <hr class="my-2">
                  <span>
                    Authority account is an account whose authority is required for the transaction to be valid. <br>
                    It is determined based on operations in the transaction. <br>
                    For example if the transaction has a vote operation, the authority account is the account that voted. <br>
                  </span>
                </div>
              </template>
            </Tooltip>
          </s-table-head>
          <s-table-head>
            <Tooltip>
              <template #activator>
                <span class="flex items-center">
                  Authority type
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </span>
              </template>
              <template #content>
                <div class="flex flex-col">
                  <span class="text-lg">Authority type</span>
                  <hr class="my-2">
                  <span>
                    Authority type is one of three types: <span class="text-posting">Posting</span>, <span class="text-active">Active</span>, <span class="text-owner">Owner</span>. <br>
                    It means that the public key that was used to sign the transaction has to be at least at this authority level. <br>
                  </span>
                </div>
              </template>
            </Tooltip>
          </s-table-head>
          <s-table-head>
            <Tooltip>
              <template #activator>
                <span class="flex items-center">
                  Satisfied
                  <v-icon size="small" class="ml-2">
                    mdi-information-slab-circle-outline
                  </v-icon>
                </span>
              </template>
              <template #content>
                <div class="flex flex-col">
                  <span class="text-lg">Satisfied state</span>
                  <hr class="my-2">
                  <span>
                    The Satisfied property indicates whether the required authorities are covered by the transaction signatures (excluding open authority case). <br>
                    It also verifies that the authority weight meets or exceeds the required threshold.
                    <b class="mt-2">Satisfied property is one of three possible values:</b>
                    <ul class="my-2">
                      <li class="text-green"><v-icon>mdi-check</v-icon> True</li>
                      <li class="text-red"><v-icon>mdi-close</v-icon> False</li>
                      <li class="text-yellow"><v-icon>mdi-alert-circle-check-outline</v-icon> Blockchain forced true</li>
                    </ul>
                  </span>
                </div>
              </template>
            </Tooltip>
          </s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row
          v-for="(item, index) in store.processedTransaction.value.requiredAuthoritiesData"
          :key="index"
        >
          <s-table-cell class="flex flex-col">
            <span
              v-for="(sig, key) in item.matchingSignature"
              v-if="Array.isArray(item.matchingSignature)"
              :key="key"
            >
              <CopyWrapper :toCopy="sig">
                <Tooltip :disabled="sig.length < 30">
                  <template #activator>
                    <span>
                      {{ waxStore.shortenString(sig) }}
                    </span>
                  </template>
                  <template #content>
                    <div class="flex flex-col">
                      <span class="text-lg">Signature:</span>
                      <hr class="my-2">
                      <span>{{ sig }}</span>
                    </div>
                  </template>
                </Tooltip>
              </CopyWrapper>
            </span>
            <span v-else>
              <CopyWrapper :toCopy="item.matchingSignature">
                <Tooltip :disabled="item.matchingSignature.length < 30">
                  <template #activator>
                    <span
                      :class="{
                        'text-red font-bold': item.matchingSignature === 'Missing signature' || item.matchingSignature === 'None',
                        'text-yellow': item.matchingSignature === 'Open authority',
                      }"
                    >
                      {{ waxStore.shortenString(item.matchingSignature) }}
                    </span>
                  </template>
                  <template #content>
                    <div class="flex flex-col">
                      <span class="text-lg">Signature:</span>
                      <hr class="my-2">
                      <span>{{ item.matchingSignature }}</span>
                    </div>
                  </template>
                </Tooltip>
              </CopyWrapper>
            </span>
          </s-table-cell>
          <s-table-cell>
            <span class="inline-flex flex-col">
              <p v-if="item.authorityAccount === 'None'" class="my-2 text-red font-semibold">
                {{ item.authorityAccount }}
              </p>
              <CopyWrapper v-else :toCopy="(item.authorityAccount as string)">
                <a class="my-2 text-blue hover:opacity-70 transition-opacity" :href="`${config.public.blockExplorerUrl}/@${item.authorityAccount}`" target="_blank">
                  {{ `@${item.authorityAccount}` }}
                </a>
              </CopyWrapper>
            </span>
          </s-table-cell>
          <s-table-cell class="p-5">
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
            <Tooltip v-else-if="item.isSatisfied[index] === ESatisfiedState.BLOCKCHAIN_FORCED_TRUE">
              <template #activator>
                <v-icon color="yellow">
                  mdi-alert-circle-check-outline
                </v-icon>
              </template>
              <template #content>
                <div class="flex flex-col">
                  <span class="text-lg">Blockchain Forced True</span>
                  <hr class="my-2">
                  <span class="leading-6">
                    The application cannot deduce the satisfied state correctly due to a missing signature of the required authority. <br>
                    Anyway we assume that the required authority is satisfied because the transaction originates from the chain and processed entry matches the required authority. <br>
                    This can happen when accout's authority has been changed after the transaction was signed.
                  </span>
                </div>
              </template>
            </Tooltip>
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
