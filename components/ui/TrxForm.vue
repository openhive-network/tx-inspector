<template>
  <div class="flex flex-col">
    <div class="my-2">
      <s-label>
        Transaction (... format)
      </s-label>
      <s-textarea placeholder="Provide your transaction" class="min-h-64 max-h-64" required />
    </div>
    <s-dialog-footer>
      <s-dialog-close as-child>
        <Button>
          Submit
        </Button>
      </s-dialog-close>
    </s-dialog-footer>
  </div>
</template>

<script lang="ts" setup>
import Button from '~/components/ui/Button.vue';
</script>
