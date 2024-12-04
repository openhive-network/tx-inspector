<script lang="ts" setup>
const props = defineProps<{ toCopy: string }>();

const copy = async (): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(props.toCopy);

    return true;
  } catch (error: any) {
    return false;
  }
};

const icon = ref('mdi-content-copy');

const changeIcon = async (): Promise<void> => {
  const success = await copy();

  if (success === true)
    icon.value = 'mdi-check';

  if (success === false)
    icon.value = 'mdi-close';

  setTimeout(() => {
    icon.value = 'mdi-content-copy';
  }, 1500);
};
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-lg hover:bg-accent pl-3 transition-colors"
  >
    <span>
      <slot />
    </span>
    <span class="cursor-pointer hover:opacity-70 transition-opacity p-3">
      <v-icon
        size="md"
        :class="{
          'text-green': icon === 'mdi-check',
          'text-red': icon === 'mdi-close',
        }"
        @click="changeIcon()"
      >
        {{ icon }}
      </v-icon>
    </span>
  </span>
</template>
