<template>
  <div class="flex flex-col gap-3 w-full">
    <Subtitle class="mb-3">
      Body:
    </Subtitle>
    <s-radio-group v-if="store.processedTransaction.value.operations.length !== 0" v-model="radioState" default-value="formatted" class="flex gap-6">
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
    <s-table v-else>
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
        <s-table-row v-for="(item, index) in store.formattedOperations.value" :key="index">
          <s-table-cell>
            <a class="text-blue" :href="`https://explore.openhive.network/@${getAuthorityForOperation(index)?.auths[index]}`">
              {{ `@${getAuthorityForOperation(index)?.auths[index]}` }}
            </a>
          </s-table-cell>
          <s-table-cell>
            <span :class="getColorForType(getAuthorityForOperation(index)?.type)">
              {{ getAuthorityForOperation(index)?.type }}
            </span>
          </s-table-cell>
          <s-table-cell>
            <v-icon :color="checkSatisfied(index) ? 'green' : 'red'">
              {{ checkSatisfied(index) ? 'mdi-check' : 'mdi-close' }}
            </v-icon>
          </s-table-cell>
          <s-table-cell>
            <span>{{ store.processedTransaction.value.operations[index].type }}</span>
          </s-table-cell>
          <s-table-cell class="max-w-[30vw]">
            <component :is="item.value.message ?? item.value" />
          </s-table-cell>
        </s-table-row>
      </s-table-body>
      <s-table-body v-show="radioState === 'json'">
        <s-table-row v-for="(item, index) in store.processedTransaction.value.operations" :key="index">
          <s-table-cell>
            <a class="text-blue" :href="`https://explore.openhive.network/@${getAuthorityForOperation(index)?.auths[index]}`">
              {{ `@${getAuthorityForOperation(index)?.auths[index]}` }}
            </a>
          </s-table-cell>
          <s-table-cell>
            <span :class="getColorForType(getAuthorityForOperation(index)?.type)">
              {{ getAuthorityForOperation(index)?.type }}
            </span>
          </s-table-cell>
          <s-table-cell>
            <v-icon :color="checkSatisfied(index) ? 'green' : 'red'">
              {{ checkSatisfied(index) ? 'mdi-check' : 'mdi-close' }}
            </v-icon>
          </s-table-cell>
          <s-table-cell>
            <span>{{ item.type }}</span>
          </s-table-cell>
          <s-table-cell class="max-w-[30vw]">
            <code>
              {{ JSON.stringify(item.value, null, 2) }}
            </code>
          </s-table-cell>
        </s-table-row>
      </s-table-body>
      <s-table-body v-show="radioState === 'binary'">
        <s-table-row v-for="(item, index) in store.processedTransaction.value.operations" :key="index">
          <s-table-cell>
            <a class="text-blue" :href="`https://explore.openhive.network/@${getAuthorityForOperation(index)?.auths[index]}`">
              {{ `@${getAuthorityForOperation(index)?.auths[index]}` }}
            </a>
          </s-table-cell>
          <s-table-cell>
            <span :class="getColorForType(getAuthorityForOperation(index)?.type)">
              {{ getAuthorityForOperation(index)?.type }}
            </span>
          </s-table-cell>
          <s-table-cell>
            <v-icon :color="checkSatisfied(index) ? 'green' : 'red'">
              {{ checkSatisfied(index) ? 'mdi-check' : 'mdi-close' }}
            </v-icon>
          </s-table-cell>
          <s-table-cell>
            <span>{{ item.type }}</span>
          </s-table-cell>
          <s-table-cell class="max-w-[30vw]">
            <BinaryView :data="store.binaryVueOutputData.value" dark />
          </s-table-cell>
        </s-table-row>
      </s-table-body>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable array-callback-return */

import type { authority, TTransactionRequiredAuthorities } from '@hiveio/wax';
import { toast } from 'vue-sonner';
import Subtitle from './Subtitle.vue';
import { EAuthorityLevel } from '~/types/wax';

const wax = useWaxStore();
const store = storeToRefs(wax);

const radioState = ref('formatted');

const checkSatisfied = (index: number): boolean => {
  const requiredAuthority = getRequiredAuthorityTypeForOperation(store.processedTransaction.value.operations[index].type);
  const authForCurrentOperation = getAuthorityForOperation(index);

  if (authForCurrentOperation === undefined) {
    toast.error('Error', {
      description: 'Cannot find operations required authorities'
    });
    return false;
  }

  if (requiredAuthority.includes(authForCurrentOperation.type as EAuthorityLevel))
    return true;

  return false;
};

const getAuthorityForOperation = (index: number): { type: EAuthorityLevel | string, auths: Array<string | authority> } | undefined => {
  let auths: TTransactionRequiredAuthorities;

  if (Array.isArray(store.processedTransaction.value.requiredAuthoritiesForOperations))
    auths = store.processedTransaction.value.requiredAuthoritiesForOperations[index];
  else
    auths = store.processedTransaction.value.requiredAuthoritiesForOperations;

  if (auths === undefined) {
    toast.error('Error', {
      description: 'Cannot find operations required authorities'
    });
    return;
  }

  if (auths.posting.size !== 0)
    return { type: EAuthorityLevel.POSTING, auths: Array.from(auths.posting) };

  if (auths.active.size !== 0)
    return { type: EAuthorityLevel.ACTIVE, auths: Array.from(auths.active) };

  if (auths.owner.size !== 0)
    return { type: EAuthorityLevel.OWNER, auths: Array.from(auths.owner) };

  if (auths.other.length !== 0)
    return { type: 'other', auths: auths.other };
};

const getRequiredAuthorityTypeForOperation = (operationType: string): EAuthorityLevel[] => {
  const authorityTypes: EAuthorityLevel[] = [];

  requiredPostingAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push(EAuthorityLevel.POSTING);
  });

  requiredActiveAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push(EAuthorityLevel.ACTIVE);
  });

  requiredOwnerAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push(EAuthorityLevel.OWNER);
  });

  requiredPostingAndActiveAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push(EAuthorityLevel.POSTING, EAuthorityLevel.ACTIVE);
  });

  requiredPostingOrActiveAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push(EAuthorityLevel.POSTING, EAuthorityLevel.ACTIVE);
  });

  requiredActiveOrOwnerAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push(EAuthorityLevel.ACTIVE, EAuthorityLevel.OWNER);
  });

  requiredEveryAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push(EAuthorityLevel.POSTING, EAuthorityLevel.ACTIVE, EAuthorityLevel.OWNER);
  });

  return authorityTypes;
};

const getColorForType = (type?: string): string => {
  if (type === undefined)
    return 'gray';

  switch (type) {
    case 'Posting':
      return 'text-green';
    case 'Active':
      return 'text-blue';
    case 'Owner':
      return 'text-orange';
    case 'Any':
      return 'text-yellow';
    case 'Every':
      return 'text-purple';
    default:
      return 'gray';
  }
};
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
