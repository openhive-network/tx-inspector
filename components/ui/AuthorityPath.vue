<template>
  <div>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <div v-for="(item, index) in store.authorityPath.value" v-else :key="index">
      {{ `${item[0]} => ${item[1].name}` }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const waxStore = useWaxStore();
const store = storeToRefs(waxStore);
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
