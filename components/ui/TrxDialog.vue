<template>
  <s-dialog>
    <s-dialog-trigger as-child>
      <Button class="button">
        Provide transaction
      </Button>
    </s-dialog-trigger>
    <s-dialog-content>
      <s-dialog-header>
        <s-dialog-title>
          Check your transaction
        </s-dialog-title>
        <s-dialog-description>
          Simply paste your transaction ...
        </s-dialog-description>
      </s-dialog-header>
      <TrxForm />
    </s-dialog-content>
  </s-dialog>
</template>

<script lang="ts" setup>
import Button from '~/components/ui/Button.vue';
import TrxForm from '~/components/ui/TrxForm.vue';
</script>
