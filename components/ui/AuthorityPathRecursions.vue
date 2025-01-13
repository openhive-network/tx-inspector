<script lang="ts" setup>
import type { IAuthorityPathEntry } from '@hiveio/wax';

const props = defineProps<{
  visitedEntries: IAuthorityPathEntry[];
}>();

const config = useRuntimeConfig();
</script>

<template>
  <div class="inline-flex">
    <span
      v-for="(entry, index) in props.visitedEntries"
      :key="index"
    >
      <span>
        <AuthorityPathRecursions :visitedEntries="entry.visitedEntries" />
      </span>
      <a
        v-if="!(entry.processedEntry.startsWith('STM'))"
        :href="`${config.public.blockExplorerUrl}/@${entry.processedEntry}`"
        :class="[
          {
            'text-posting': entry.processedRole === 'posting',
            'text-active': entry.processedRole === 'active',
            'text-owner': entry.processedRole === 'owner',
          },
          'hover:opacity-70 transition-opacity'
        ]"
      >
        {{ `@${entry.processedEntry}` }}
      </a>
      <span v-if="!(entry.processedEntry.startsWith('STM'))" class="ml-1">{{ `(${entry.weight}/${entry.threshold})` }}</span>
      <v-icon v-if="!(entry.processedEntry.startsWith('STM'))">mdi-chevron-right</v-icon>
    </span>
  </div>
</template>
