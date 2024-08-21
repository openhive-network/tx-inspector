import type { TAccountName } from '@hiveio/wax';
import { defineStore } from 'pinia';
import { EAuthorityLevel, EPackType } from '~/types/wax';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    signatures: [] as string[],
    pack: EPackType.HF26,
    publicKeys: [] as string [],
    authorityPath: new Map<TAccountName, IAuthorityNode>(),
    id: '',
    sigDigest: '',
    authorityType: EAuthorityLevel.POSTING,
    isLoading: false
  })
});
