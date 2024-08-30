import { ApiOperation } from '@hiveio/wax';
import { defineStore } from 'pinia';
import { toast } from '~/components/shadcn/toast';
import { EAuthorityLevel, EPackType } from '~/types/wax';
import type { IAuthorityPaths } from '~/utils/getAuthorityPath';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    signatures: [] as string[],
    pack: EPackType.HF26,
    publicKeys: [] as string [],
    authorityPath: [] as IAuthorityPaths[],
    id: '',
    sigDigest: '',
    isValid: false,
    authorityType: [] as EAuthorityLevel[],
    operations: [] as ApiOperation[],
    formattedOperations: [] as any[],
    signeesByKeys: [] as string[][],
    isSatisfied: false,
    isLoading: false
  }),

  actions: {
    async copy (string: string): Promise<void> {
      try {
        await navigator.clipboard.writeText(string);
        toast({
          title: 'Copied to clipboard!',
          description: string.length > 30 ? `${string.slice(0, 30)}...` : string
        });
      } catch (error: any) {
        toast({
          title: 'Failed to copy',
          variant: 'destructive'
        });
      }
    }
  }
});
