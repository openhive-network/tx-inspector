<template>
  <div>
    <h3>Required Authorities:</h3>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <s-table v-else>
      <s-table-header>
        <s-table-row>
          <s-table-head>Authority type</s-table-head>
          <s-table-head>Authority accounts</s-table-head>
          <s-table-head>Satisfied</s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row v-for="(level, index) in store.authorityType.value" v-if="store.id.value.length > 0" :key="index">
          <s-table-cell class="p-5">
            <span>{{ level.level }}</span>
          </s-table-cell>
          <s-table-cell>
            <span class="flex flex-col">
              <span v-for="(account, key) in level.accounts" :key="key" class="my-1">
                {{ account }}
              </span>
            </span>
          </s-table-cell>
          <s-table-cell class="p-5">
            <v-icon :color="store.isSatisfied.value ? 'green' : 'red'">
              {{ store.isSatisfied.value ? 'mdi-check' : 'mdi-close' }}
            </v-icon>
          </s-table-cell>
        </s-table-row>
      </s-table-body>
    </s-table>
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
