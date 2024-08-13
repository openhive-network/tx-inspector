<template>
  <div class="flex flex-col">
    <div class="my-2">
      <s-label>
        Transaction ({{ radioState }} format)
      </s-label>
      <s-input v-if="radioState === 'hash'" placeholder="Provide your transaction hash" class="my-3" required />
      <s-textarea v-else :placeholder="`Provide your transaction ${radioState}`" class="min-h-64 max-h-64 my-3" required />
    </div>
    <s-dialog-footer class="flex justify-between sm:justify-between items-center">
      <s-radio-group v-model="radioState" default-value="json">
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="json" value="json" />
          <s-label for="json">
            JSON
          </s-label>
        </div>
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="hash" value="hash" />
          <s-label for="hash">
            Hash (ID)
          </s-label>
        </div>
        <div class="flex items-center space-x-2">
          <s-radio-group-item id="binary" value="binary" />
          <s-label for="binary">
            Binary
          </s-label>
        </div>
      </s-radio-group>
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

const radioState = ref('json');
</script>
