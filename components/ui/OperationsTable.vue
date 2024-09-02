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
          <s-table-head>Signed By</s-table-head>
          <s-table-head>Authority type</s-table-head>
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
        </s-table-row>
      </s-table-body>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable array-callback-return */

const store = useWaxStore();

const radioState = ref('formatted');

const getRequiredAuthorityForOperation = (operationType: string): string[] => {
  const authorityTypes: string[] = [];

  requiredPostingAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push('Posting');
  });

  requiredActiveAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push('Active');
  });

  requiredOwnerAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push('Owner');
  });

  requiredPostingAndActiveAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push('Posting', 'and', 'Active');
  });

  requiredPostingOrActiveAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push('Posting', 'or', 'Active');
  });

  requiredActiveOrOwnerAuthority.some((operation) => {
    if (operation === operationType)
      authorityTypes.push('Active', 'or', 'Owner');
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
