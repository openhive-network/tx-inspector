import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';
import { type ApiTransaction, type IBinaryViewOutputData, type IWaxExtendableFormatter, type THexString } from '@hiveio/wax';
import { type TxInspectorEngine } from '#imports';
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
    binary: undefined as THexString | undefined,
    qs: undefined as unknown as URLSearchParams,
    tx: undefined as string | undefined,
    binaryVueOutputData: undefined as IBinaryViewOutputData | undefined,
    processingTime: 0,
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
      isValid: false,
      tapos: { refBlockNum: 0, refBlockPrefix: 0 },
      expiration: '',
      authorityPath: [] as IAuthorityPaths[],
      isSatisfied: false,
      isSatisfiedForOperation: [] as boolean[]
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
    },

    useOperationsFormatter (formatter: IWaxExtendableFormatter, operations: any) {
      return formatter.format(operations);
    },

    async handleTransactionFromHash (inspector: TxInspectorEngine, formatter: IWaxExtendableFormatter, hash: string): Promise<void> {
      this.id = hash;

      const tx = await inspector.processTransactionId(hash);
      this.$state.processedTransaction = tx;
      this.$state.formattedOperations = this.useOperationsFormatter(formatter, tx.transaction.transaction).operations;
      this.$state.binaryVueOutputData = tx.transaction.binaryViewMetadata;
      (this.$state.tx as unknown as ApiTransaction) = tx.transaction.toApiJson();
    },

    async handleTransactionFromJson (inspector: TxInspectorEngine, formatter: IWaxExtendableFormatter, json: string): Promise<void> {
      this.$state.json = JSON.parse(String(json!.trim()));

      const tx = await inspector.processTransaction(JSON.parse(String(json!.trim())) as unknown as ApiTransaction);
      this.$state.processedTransaction = tx;
      this.$state.formattedOperations = this.useOperationsFormatter(formatter, tx.transaction.transaction).operations;
      this.$state.binaryVueOutputData = tx.transaction.binaryViewMetadata;
      (this.$state.tx as unknown as ApiTransaction) = tx.transaction.toApiJson();
    },

    async handleTransactionFromBinary (inspector: TxInspectorEngine, formatter: IWaxExtendableFormatter, binary: string): Promise<void> {
      this.$state.binary = binary;

      const tx = await inspector.processTransactionBinary(binary);
      this.$state.processedTransaction = tx;
      this.$state.formattedOperations = this.useOperationsFormatter(formatter, tx.transaction.transaction).operations;
      this.$state.binaryVueOutputData = tx.transaction.binaryViewMetadata;
      (this.$state.tx as unknown as ApiTransaction) = tx.transaction.toApiJson();
    }
  }
});
