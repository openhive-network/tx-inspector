<template>
  <div>
    <h3>Transaction:</h3>
    <s-skeleton v-if="store.isLoading.value" class="w-full h-[100px] skeleton" />
    <s-table v-else>
      <s-table-header>
        <s-table-row>
          <s-table-head>ID</s-table-head>
          <s-table-head>Sig Digest</s-table-head>
        </s-table-row>
      </s-table-header>
      <s-table-body>
        <s-table-row v-if="store.id.value.length > 0">
          <s-table-cell>
            <s-tooltip-provider>
              <s-tooltip>
                <s-tooltip-trigger v-if="typeof store.id.value === 'string'" as-child>
                  <span
                    class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
                    @click="waxStore.copy(store.id.value)"
                  >
                    <span>
                      {{ `${store.id.value.slice(0, 5)}...${store.id.value.slice(-5)}` }}
                    </span>
                    <v-icon size="md">mdi-content-copy</v-icon>
                  </span>
                </s-tooltip-trigger>
                <div v-else class="flex flex-col">
                  <s-tooltip-provider>
                    <s-tooltip>
                      <s-tooltip-trigger as-child>
                        <span
                          class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer mb-3"
                          @click="waxStore.copy(store.id.value[0])"
                        >
                          <span>
                            HF26: {{ `${store.id.value[0].slice(0, 5)}...${store.id.value[0].slice(-5)}` }}
                          </span>
                          <v-icon size="md">mdi-content-copy</v-icon>
                        </span>
                      </s-tooltip-trigger>
                      <s-tooltip-content>
                        <div class="flex flex-col">
                          <span class="text-lg">HF26 ID</span>
                          <hr class="my-2">
                          <span>{{ store.id.value[0] }}</span>
                        </div>
                      </s-tooltip-content>
                    </s-tooltip>
                  </s-tooltip-provider>
                  <s-tooltip-trigger as-child>
                    <span
                      class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer mb-3"
                      @click="waxStore.copy(store.id.value[1])"
                    >
                      <span>
                        Legacy: {{ `${store.id.value[1].slice(0, 5)}...${store.id.value[1].slice(-5)}` }}
                      </span>
                      <v-icon size="md">mdi-content-copy</v-icon>
                    </span>
                  </s-tooltip-trigger>
                  <s-tooltip-content>
                    <div class="flex flex-col">
                      <span class="text-lg">Legacy ID</span>
                      <hr class="my-2">
                      <span>{{ store.id.value[1] }}</span>
                    </div>
                  </s-tooltip-content>
                </div>
                <s-tooltip-content v-if="typeof store.id.value === 'string'">
                  <div class="flex flex-col">
                    <span class="text-lg">ID</span>
                    <hr class="my-2">
                    <span>{{ store.id.value }}</span>
                  </div>
                </s-tooltip-content>
              </s-tooltip>
            </s-tooltip-provider>
          </s-table-cell>
          <s-table-cell>
            <s-tooltip-provider>
              <s-tooltip>
                <s-tooltip-trigger v-if="typeof store.sigDigest.value === 'string'" as-child>
                  <span
                    class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer"
                    @click="waxStore.copy(store.sigDigest.value)"
                  >
                    <span>
                      {{ `${store.sigDigest.value.slice(0, 5)}...${store.sigDigest.value.slice(-5)}` }}
                    </span>
                    <v-icon size="md">mdi-content-copy</v-icon>
                  </span>
                </s-tooltip-trigger>
                <div v-else class="flex flex-col">
                  <s-tooltip-provider>
                    <s-tooltip>
                      <s-tooltip-trigger as-child>
                        <span
                          class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer mb-3"
                          @click="waxStore.copy(store.sigDigest.value[0])"
                        >
                          <span>
                            HF26: {{ `${store.sigDigest.value[0].slice(0, 5)}...${store.sigDigest.value[0].slice(-5)}` }}
                          </span>
                          <v-icon size="md">mdi-content-copy</v-icon>
                        </span>
                      </s-tooltip-trigger>
                      <s-tooltip-content>
                        <div class="flex flex-col">
                          <span class="text-lg">HF26 Sig Digest</span>
                          <hr class="my-2">
                          <span>{{ store.sigDigest.value[0] }}</span>
                        </div>
                      </s-tooltip-content>
                    </s-tooltip>
                  </s-tooltip-provider>
                  <s-tooltip-trigger as-child>
                    <span
                      class="inline-flex items-center transition-colors gap-2 p-3 rounded-lg hover:bg-accent hover:cursor-pointer mb-3"
                      @click="waxStore.copy(store.sigDigest.value[1])"
                    >
                      <span>
                        Legacy: {{ `${store.sigDigest.value[1].slice(0, 5)}...${store.sigDigest.value[1].slice(-5)}` }}
                      </span>
                      <v-icon size="md">mdi-content-copy</v-icon>
                    </span>
                  </s-tooltip-trigger>
                  <s-tooltip-content>
                    <div class="flex flex-col">
                      <span class="text-lg">Legacy Sig Digest</span>
                      <hr class="my-2">
                      <span>{{ store.sigDigest.value[1] }}</span>
                    </div>
                  </s-tooltip-content>
                </div>
                <s-tooltip-content v-if="typeof store.sigDigest.value === 'string'">
                  <div class="flex flex-col">
                    <span class="text-lg">Sig Digest</span>
                    <hr class="my-2">
                    <span>{{ store.sigDigest.value }}</span>
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
const waxStore = useWaxStore();
const store = storeToRefs(waxStore);
</script>

<style scoped>
.skeleton {
  background: rgb(63 63 70);
}
</style>
