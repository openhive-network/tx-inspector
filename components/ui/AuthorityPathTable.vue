<template>
  <div>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <s-table v-else>
      <s-table-header>
        <s-table-row>
          <s-table-head>Signature</s-table-head>
          <s-table-head>Pack</s-table-head>
          <s-table-head>Public key</s-table-head>
          <s-table-head>Authority path</s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row v-for="(signature, index) in store.signatures.value" :key="index">
          <s-table-cell>
            {{ `${signature.slice(0, 5)}...${signature.slice(-5)}` }}
          </s-table-cell>
          <s-table-cell>
            {{ store.pack.value }}
          </s-table-cell>
          <s-table-cell>
            {{ `${store.publicKeys.value[index].slice(0, 5)}...${store.publicKeys.value[index].slice(-5)}` }}
          </s-table-cell>
          <s-table-cell v-if="Array.isArray(getPath())">
            {{ getPath()[index] }}
          </s-table-cell>
          <s-table-cell v-else>
            {{ getPath() }}
          </s-table-cell>
        </s-table-row>
      </s-table-body>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
const waxStore = useWaxStore();
const store = storeToRefs(waxStore);

const getPath = () => {
  const path = [];

  const authoritiesArr = Array.from(store.authorityPath.value);

  if (authoritiesArr.length > 1) {
    for (let i = 0; i < authoritiesArr.length; ++i)
      path.push(authoritiesArr[i][0]);

    return path;
  }

  const pathElement = store.authorityPath.value.values().next().value;

  if (pathElement) {
    path.push(pathElement.name);

    if (pathElement.rootNode) {
      let currentNode = pathElement;
      while (currentNode.rootNode) {
        path.push(currentNode.rootNode.name);
        currentNode = currentNode.rootNode;
      }
    }
  }
  return path.reverse().join(' > ');
};
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
