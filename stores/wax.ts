import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';
import { type ApiTransaction, type IBinaryViewOutputData, type ITransaction, type IWaxExtendableFormatter, type THexString } from '@hiveio/wax/vite';
import { type TxInspectorEngine } from '#imports';
import { EPackType, type IProcessedTransaction, type IRequiredAuthoritiesData, type ISignatureTraceData, type ITransactionBodyData, type ITransactionData, type ITransactionOtherData } from '~/types/wax';

export const useWaxStore = defineStore('wax', {
  state: () => ({
    formattedOperations: [] as any[],
    isLoading: false,
    trxDialogOpen: false,
    id: undefined as string | undefined,
    json: undefined as string | undefined,
    binary: undefined as THexString | undefined,
    qs: undefined as unknown as URLSearchParams,
    tx: undefined as string | undefined,
    binaryViewOutputData: undefined as IBinaryViewOutputData | undefined,
    legacyBinaryViewOutputData: undefined as IBinaryViewOutputData | undefined,
    defaultBinaryRadioState: '',
    processingTime: 0,
    processedTransaction: {
      signatureData: [] as ISignatureTraceData[],
      transactionData: {
        id: '',
        sigDigest: '',
        tapos: { refBlockNum: 0, refBlockPrefix: 0 },
        expirationTime: ''
      } as ITransactionData,
      requiredAuthoritiesData: [] as IRequiredAuthoritiesData[],
      transactionBodyData: [] as ITransactionBodyData[],
      transactionOtherData: {
        isValid: false,
        transaction: {} as ITransaction,
        signeesByKeys: [[]] as string[][]
      } as ITransactionOtherData
    } as IProcessedTransaction
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

    defaultBinaryRadioState (): string {
      if (!this.$state.processedTransaction.signatureData[0])
        return 'hf26-binary';

      if (Array.isArray(this.$state.processedTransaction.signatureData[0].rows[0].packType)) {
        if (this.$state.processedTransaction.signatureData[0].rows[0].packType[0] === EPackType.HF26)
          return 'hf26-binary';

        if (this.$state.processedTransaction.signatureData[0].rows[0].packType[0] === EPackType.LEGACY)
          return 'legacy-binary';

        return 'hf26-binary';
      }

      if (this.$state.processedTransaction.signatureData[0].rows[0].packType === EPackType.HF26)
        return 'hf26-binary';

      if (this.$state.processedTransaction.signatureData[0].rows[0].packType === EPackType.LEGACY)
        return 'legacy-binary';

      return 'hf26-binary';
    },

    async handleTransactionFromHash (inspector: TxInspectorEngine, formatter: IWaxExtendableFormatter, hash: string): Promise<void> {
      this.id = hash;

      const tx = await inspector.processTransactionId(hash);
      this.$state.processedTransaction = tx;
      this.$state.formattedOperations = this.useOperationsFormatter(formatter, tx.transactionOtherData.transaction.transaction).operations;
      this.$state.binaryViewOutputData = tx.transactionOtherData.transaction.binaryViewMetadata;
      this.$state.legacyBinaryViewOutputData = tx.transactionOtherData.transaction.legacy_binaryViewMetadata;
      this.$state.defaultBinaryRadioState = this.defaultBinaryRadioState();
      (this.$state.tx as unknown as ApiTransaction) = tx.transactionOtherData.transaction.toApiJson();
    },

    async handleTransactionFromJson (inspector: TxInspectorEngine, formatter: IWaxExtendableFormatter, json: string): Promise<void> {
      const jsonTx = JSON.parse(String(json!.trim())) as unknown as ApiTransaction;
      this.$state.json = jsonTx as unknown as string;

      const signaturesArr = jsonTx.signatures[0] === null ? [] : jsonTx.signatures;

      jsonTx.signatures = signaturesArr;

      const tx = await inspector.processTransaction(jsonTx);
      this.$state.processedTransaction = tx;
      this.$state.formattedOperations = this.useOperationsFormatter(formatter, tx.transactionOtherData.transaction.transaction).operations;
      this.$state.binaryViewOutputData = tx.transactionOtherData.transaction.binaryViewMetadata;
      this.$state.legacyBinaryViewOutputData = tx.transactionOtherData.transaction.legacy_binaryViewMetadata;
      this.$state.defaultBinaryRadioState = this.defaultBinaryRadioState();
      (this.$state.tx as unknown as ApiTransaction) = tx.transactionOtherData.transaction.toApiJson();
    },

    async handleTransactionFromBinary (inspector: TxInspectorEngine, formatter: IWaxExtendableFormatter, binary: string): Promise<void> {
      this.$state.binary = binary;

      const tx = await inspector.processTransactionBinary(binary);
      this.$state.processedTransaction = tx;
      this.$state.formattedOperations = this.useOperationsFormatter(formatter, tx.transactionOtherData.transaction.transaction).operations;
      this.$state.binaryViewOutputData = tx.transactionOtherData.transaction.binaryViewMetadata;
      this.$state.legacyBinaryViewOutputData = tx.transactionOtherData.transaction.legacy_binaryViewMetadata;
      this.$state.defaultBinaryRadioState = this.defaultBinaryRadioState();
      (this.$state.tx as unknown as ApiTransaction) = tx.transactionOtherData.transaction.toApiJson();
    },

    shortenString (string: string): string {
      if (string.length > 30)
        return `${string.slice(0, 5)}...${string.slice(-5)}`;

      return string;
    }
  }
});
