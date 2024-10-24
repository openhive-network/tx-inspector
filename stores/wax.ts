import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';
import { type ApiTransaction, type IBinaryViewOutputData, type IWaxExtendableFormatter, type TWaxExtended } from '@hiveio/wax';
import { type TxInspectorEngine, getAuthorityPath } from '#imports';
import { EPackType, type TChainExtendedApiData, type TProcessedTransaction } from '~/types/wax';
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
    binary: undefined as string | undefined,
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
      expiration: ''
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

    async handleAuthorityPath (chain: TWaxExtended<TChainExtendedApiData>) {
      const authorityPath = await getAuthorityPath(chain, this.$state.tx as unknown as ApiTransaction, new TransactionAnalyzerApiProvider(chain));

      if (authorityPath) {
        authorityPath.push(authorityPath.shift()!);
        this.$state.authorityPath = authorityPath;

        let totalWeight = 0;
        let totalThreshold = 0;

        for (let i = 0; i < authorityPath.length; ++i)
          if (authorityPath[i].authWeight) {
            totalWeight += authorityPath[i].authWeight!.auth;
            totalThreshold += authorityPath[i].authWeight!.weight;
          }

        if (totalWeight >= totalThreshold)
          this.$state.isSatisfied = true;
        else
          this.$state.isSatisfied = false;
      }
    }
  }
});
