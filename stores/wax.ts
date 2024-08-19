import type { TAccountName } from '@hiveio/wax';
import { defineStore } from 'pinia';
import { EPackType } from '~/types/wax';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    signatures: [],
    pack: EPackType.HF26,
    publicKeys: [],
    authorityPath: new Map<TAccountName, IAuthorityNode>(),
    id: '',
    sigDigest: '',
    isLoading: false
  })
});
