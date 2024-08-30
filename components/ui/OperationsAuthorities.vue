<template>
  <div class="w-1/2" :class="store.$state.isLoading ? 'mt-n6' : ''">
    <h3>
      Operations Authorities:
    </h3>
    <s-skeleton v-if="store.$state.isLoading" class="w-full h-[100px] skeleton" />
    <div v-for="(item, key) in store.$state.operations" v-else :key="key" class="mt-4">
      <span v-for="(type, index) in getRequiredAuthorityForOperation(item.type)" :key="index">
        <span>
          {{ key + 1 }}.
          Signed by:
          <a class="text-blue" :href="`https://explore.openhive.network/@${store.$state.signeesByKeys[key][0]}`">
            {{ `@${store.$state.signeesByKeys[key][0]}` }}
          </a>
        </span>
        Auth type: <span :class="getColorForType(type)">{{ type }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable array-callback-return */

const store = useWaxStore();

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
