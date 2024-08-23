import { ApiOperation, type TAccountName } from '@hiveio/wax';
import { defineStore } from 'pinia';
import { toast } from '~/components/shadcn/toast';
import { EAuthorityLevel, EPackType } from '~/types/wax';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    signatures: [] as string[],
    pack: EPackType.HF26,
    publicKeys: [] as string [],
    authorityPath: new Map<TAccountName, IAuthorityNode>(),
    id: '',
    sigDigest: '',
    isValid: false,
    authorityType: EAuthorityLevel.POSTING,
    operations: [] as ApiOperation[],
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
