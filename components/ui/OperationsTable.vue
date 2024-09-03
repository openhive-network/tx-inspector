<template>
  <div class="flex flex-col gap-3 w-full">
    <s-radio-group v-if="store.$state.operations.length !== 0" v-model="radioState" default-value="formatted" class="flex gap-6">
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
        <s-radio-group-item id="binary" value="binary" disabled />
        <s-label for="binary">
          Binary
        </s-label>
      </div>
    </s-radio-group>
    <s-skeleton v-if="store.$state.isLoading" class="w-full h-[100px] skeleton" />
    <s-table v-else>
      <s-table-header>
        <s-table-row>
          <s-table-head>Operation type</s-table-head>
          <s-table-head>Operation content</s-table-head>
          <s-table-head>Authority account</s-table-head>
          <s-table-head>Authority type</s-table-head>
          <s-table-head>Satisfied</s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body v-show="radioState === 'formatted'">
        <s-table-row v-for="(item, index) in store.$state.formattedOperations" :key="index">
          <s-table-cell>
            <span>{{ item.type }}</span>
          </s-table-cell>
          <s-table-cell class="max-w-[30vw]">
            <component :is="item.value" />
          </s-table-cell>
          <s-table-cell>
            <a class="text-blue" :href="`https://explore.openhive.network/@${store.$state.signeesByKeys[index][0]}`">
              {{ `@${store.$state.signeesByKeys[index][0]}` }}
            </a>
          </s-table-cell>
          <s-table-cell>
            <span :class="getColorForType(getRequiredAuthorityForOperation(item.type)[0])">
              {{ getRequiredAuthorityForOperation(item.type)[0] }}
            </span>
          </s-table-cell>
          <s-table-cell>
            <v-icon :color="checkSatisfied(getRequiredAuthorityForOperation(item.type)[0], store.$state.signeesByKeys[index][0]) ? 'green' : 'red'">
              {{ checkSatisfied(getRequiredAuthorityForOperation(item.type)[0], store.$state.signeesByKeys[index][0]) ? 'mdi-check' : 'mdi-close' }}
            </v-icon>
          </s-table-cell>
        </s-table-row>
      </s-table-body>
      <s-table-body v-show="radioState === 'json'">
        <s-table-row v-for="(item, index) in store.$state.operations" :key="index">
          <s-table-cell>
            <span>{{ item.type }}</span>
          </s-table-cell>
          <s-table-cell class="max-w-[30vw]">
            <code>
              {{ JSON.stringify(item.value, null, 2) }}
            </code>
          </s-table-cell>
          <s-table-cell>
            <a class="text-blue" :href="`https://explore.openhive.network/@${store.$state.signeesByKeys[index][0]}`">
              {{ `@${store.$state.signeesByKeys[index][0]}` }}
            </a>
          </s-table-cell>
          <s-table-cell>
            <span :class="getColorForType(getRequiredAuthorityForOperation(item.type)[0])">
              {{ getRequiredAuthorityForOperation(item.type)[0] }}
            </span>
          </s-table-cell>
          <s-table-cell>
            <v-icon :color="checkSatisfied(getRequiredAuthorityForOperation(item.type)[0], store.$state.signeesByKeys[index][0]) ? 'green' : 'red'">
              {{ checkSatisfied(getRequiredAuthorityForOperation(item.type)[0], store.$state.signeesByKeys[index][0]) ? 'mdi-check' : 'mdi-close' }}
            </v-icon>
          </s-table-cell>
        </s-table-row>
      </s-table-body>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable array-callback-return */

import { toast } from 'vue-sonner';
import { EAuthorityLevel } from '~/types/wax';

const store = useWaxStore();

const radioState = ref('formatted');

const checkSatisfied = (authType: EAuthorityLevel | string, authAccount: string): boolean => {
  const requiredAuthorityType = store.$state.authorityType;

  if (requiredAuthorityType === undefined)
    toast.error('Error', {
      description: 'Cannot find required authorities'
    });

  for (let i = 0; i < requiredAuthorityType.length; ++i) {
    const el = requiredAuthorityType[i];

    for (const acc of el.accounts)
      if (acc === authAccount && el.level === authType)
        return true;
  }

  return false;
};

const getRequiredAuthorityForOperation = (operationType: string): EAuthorityLevel[] | string[] => {
  const authorityTypes: string[] = [];

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
      authorityTypes.push(EAuthorityLevel.POSTING, 'and', EAuthorityLevel.ACTIVE);
  });

  requiredPostingOrActiveAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push(EAuthorityLevel.POSTING, 'or', EAuthorityLevel.ACTIVE);
  });

  requiredActiveOrOwnerAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push(EAuthorityLevel.ACTIVE, 'or', EAuthorityLevel.OWNER);
  });

  requiredAnyAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push('Any');
  });

  requiredEveryAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push('Every');
  });

  return authorityTypes;
};

const getColorForType = (type: string): string => {
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
