<template>
  <div class="w-1/2">
    <v-expansion-panels bg-color="black">
      <v-expansion-panel>
        <v-expansion-panel-title>Operations</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-expansion-panels bg-color="black">
            <v-expansion-panel v-for="(item, index) in store.$state.operations" :key="index">
              <v-expansion-panel-title>{{ item.type }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <code class="pre">
                  {{ item.value }}
                </code>
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
</script>

<style scoped>
.pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
