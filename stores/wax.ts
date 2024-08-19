import type { TAccountName } from '@hiveio/wax';
import { defineStore } from 'pinia';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    authorityPath: new Map<TAccountName, IAuthorityNode>(),
    isLoading: false
  })
});
