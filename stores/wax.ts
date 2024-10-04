import { ApiOperation, authority, type TTransactionRequiredAuthorities } from '@hiveio/wax';
import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';
import { EAuthorityLevel, EPackType, type TProcessedTransaction } from '~/types/wax';
import type { IAuthorityPaths } from '~/utils/getAuthorityPath';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    signatures: [] as string[],
    pack: EPackType.HF26,
    publicKeys: [] as string [],
    authorityPath: [] as IAuthorityPaths[],
    id: '' as string | { hf26: string, legacy: string },
    sigDigest: '' as string | { hf26: string, legacy: string },
    isValid: false,
    authorityType: [] as { level: EAuthorityLevel, accounts: Set<string> | Array<authority> }[],
    operations: [] as ApiOperation[],
    formattedOperations: [] as any[],
    signeesByKeys: [] as string[][],
    isSatisfied: false,
    isLoading: false,
    trxDialogOpen: false,
    authoritiesForOperation: [] as unknown as TTransactionRequiredAuthorities[],
    processedTransaction: {
      packType: EPackType.UNKNOWN,
      signatures: [],
      signatureKeys: [],
      transactionId: '',
      sigDigest: '',
      requiredAuthorities: [],
      authorityType: [],
      operations: [],
      signeesByKeys: [],
      isValid: false
    } as unknown as TProcessedTransaction
  }),

  actions: {
    async copy (string: string): Promise<void> {
      try {
        await navigator.clipboard.writeText(string);
        toast.success('Copied to clipboard', {
          description: string.length > 30 ? `${string.slice(0, 30)}...` : string
        });
      } catch (error: any) {
        toast.error('Error', {
          description: 'Failed to copy'
        });
      }
    }
  }
});
