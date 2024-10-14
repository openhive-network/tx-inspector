import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';
import { EPackType, type TProcessedTransaction } from '~/types/wax';
import type { IAuthorityPaths } from '~/utils/getAuthorityPath';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    authorityPath: [] as IAuthorityPaths[],
    formattedOperations: [] as any[],
    isSatisfied: false,
    isLoading: false,
    trxDialogOpen: false,
    id: undefined as string | undefined,
    json: undefined as string | undefined,
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
