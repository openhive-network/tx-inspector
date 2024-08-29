<template>
  <div class="flex flex-col gap-3 w-1/2">
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
    <v-expansion-panels v-else bg-color="black" eager>
      <v-expansion-panel eager>
        <v-expansion-panel-title>
          Operations ({{ radioState }})
        </v-expansion-panel-title>
        <v-expansion-panel-text eager>
          <v-expansion-panels bg-color="black" eager>
            <v-expansion-panel v-for="(item, index) in store.$state.operations" v-show="radioState === 'json'" :key="index" eager>
              <v-expansion-panel-title>
                <span class="mr-6">{{ `${index + 1}. ${item.type}` }}</span>
              </v-expansion-panel-title>
              <v-expansion-panel-text eager>
                <code>
                  {{ JSON.stringify(item.value, null, 2) }}
                </code>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel v-for="(item, key) in store.$state.formattedOperations" v-show="radioState === 'formatted'" :key="key" eager>
              <v-expansion-panel-title>
                <span class="mr-6">{{ `${key + 1}. ${item.type}` }}</span>
              </v-expansion-panel-title>
              <v-expansion-panel-text eager>
                <component :is="item.value" />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts" setup>
const store = useWaxStore();

const radioState = ref('formatted');
</script>

<style scoped>
.pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
