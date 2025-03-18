<template>
  <v-menu
    :disabled="tooltipProps.disabled"
    open-on-click
    open-on-hover
    no-click-animation
    location="top center"
    close-delay="50"
  >
    <template #activator="{ props }">
      <span v-bind="props">
        <slot name="activator" />
      </span>
    </template>
    <template #default>
      <div class="rounded-md px-3 py-1.5 text-sm text-primary-foreground flex flex-col" :class="tooltipProps.error ? 'bg-destructive' : 'bg-[#3f3f46]'">
        <slot name="content" />
      </div>
    </template>
  </v-menu>
</template>

<script lang="ts" setup>
const tooltipProps = defineProps<{
  disabled?: boolean;
  error?: boolean;
}>();
</script>
