/* eslint-disable no-eval */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import fs from 'node:fs';

import { type ConsoleMessage, type Page, test as base } from '@playwright/test';

import './globals';

import type { ApiTransaction, IWaxOptions } from '@hiveio/wax/vite';

import type { IProcessedTransaction } from '../../types/wax';
import type { ITxAnalyzerGlobals, ITxInspectorGlobals } from './globals';
import type { IMockData, TMockExtendedData } from './api-mock';

type TTxInspectorTestCallable<R, Args extends any[]> = (globals: ITxInspectorGlobals, ...args: Args) => (R | Promise<R>);
type TTxAnalyzerTestCallable<R, Args extends any[]> = (globals: ITxAnalyzerGlobals, ...args: Args) => (R | Promise<R>);

export interface ITxInspectorTest {
  customChainId: IWaxOptions | undefined;

  /**
   * Path to the mock data file.
   */
  fixtureLevelMockFile: string;

  /**
   * Mock data loaded from the file.
   */
  mockData: TMockExtendedData;

  /**
   * Runs given function in the browser context and returns the result.
   *
   * Uses real wax API interface to process the transaction.
   *
   * If you want to use the mock data, please use {@link txInspectorMockedTest} method instead.
   */
  txInspectorTest: (<R, Args extends any[]>(fn: TTxInspectorTestCallable<R, Args>, ...args: Args) => Promise<R>);

  /**
   * Runs given function in the browser context and returns the result.
   *
   * Uses the mock data loaded from the json file provided in a fixture to process the transaction.
   *
   * If you want to use the real wax API interface, please use {@link txInspectorTest} method instead.
   */
  txAnalyzerMockedTest: (<R, Args extends any[]>(fn: TTxAnalyzerTestCallable<R, Args>, ...args: Args) => Promise<R>);

  analyzeAndCompareTransaction: (inputTransaction: ApiTransaction, expectedResult: IProcessedTransaction) => Promise<boolean>;
}

const txInspectorTest = (page: Page): ITxInspectorTest['txInspectorTest'] => {
  page.on('console', (msg: ConsoleMessage) => {
    console.log('>>', msg.type(), msg.text());
  });

  const runner = async <R, Args extends any[]>(fn: TTxInspectorTestCallable<R, Args>, ...args: Args): Promise<R> => {
    await page.goto('http://localhost:8080/__tests__/assets/test.html', { waitUntil: 'load' });

    const webData = await page.evaluate(async ({ args, webFn, customChainId }) => {
      eval(`window.webEvalFn = ${webFn};`);
      globalThis.customChainId = customChainId;
      return (window as Window & typeof globalThis & { webEvalFn: Function }).webEvalFn(await globalThis.createTxInspectorTestFor(), ...args);
    }, { args, webFn: fn.toString(), customChainId: globalThis.customChainId });

    return webData;
  };

  return runner;
};

const txAnalyzerMockedTestEnvironment = (
  page: Page,
  mockData: IMockData
): ITxInspectorTest['txAnalyzerMockedTest'] => {
  page.on('console', (msg: ConsoleMessage) => {
    console.log('>>', msg.type(), msg.text());
  });

  const runner = async <R, Args extends any[]>(fn: TTxAnalyzerTestCallable<R, Args>, ...args: Args): Promise<R> => {
    await page.goto('http://localhost:8080/__tests__/assets/test.html', { waitUntil: 'load' });

    const webData = await page.evaluate(async ({ args, webFn, mockData }) => {
      eval(`window.webEvalFn = ${webFn};`);
      return (window as Window & typeof globalThis & { webEvalFn: Function }).webEvalFn(await globalThis.createTxAnalyzerTestFor(mockData), ...args);
    }, { args, webFn: fn.toString(), mockData });

    return webData;
  };

  return runner;
};

const analyzeAndCompareTransaction = async (
  txAnalyzerMockedTest: ITxInspectorTest['txAnalyzerMockedTest'],
  inputTransaction: ApiTransaction,
  expectedResult: IProcessedTransaction
): Promise<boolean> => {
  const retVal = await txAnalyzerMockedTest(async ({ analyzer }, inputTx) => {
    const processingResults = await analyzer.analyzeTransaction(inputTx);

    return {
      signatureData: processingResults.signatureData,
      transactionData: processingResults.transactionData,
      requiredAuthoritiesData: processingResults.requiredAuthoritiesData,
      transactionBodyData: processingResults.transactionBodyData,
      transactionOtherData: { isValid: processingResults.transactionOtherData.isValid, signeesByKeys: processingResults.transactionOtherData.signeesByKeys }
    };
  }, inputTransaction);

  console.log('retVal', JSON.stringify(retVal, null, 2));
  return JSON.stringify(retVal) === JSON.stringify(expectedResult);
};

export const test = base.extend<ITxInspectorTest>({
  customChainId: { chainId: 'beeab0de00000000000000000000000000000000000000000000000000000000' },
  fixtureLevelMockFile: ['', { option: true }],

  mockData: async ({ fixtureLevelMockFile }, use) => {
    const mockDataFilePath = path.resolve(process.cwd(), fixtureLevelMockFile);
    let mockData!: TMockExtendedData;

    if (fs.existsSync(mockDataFilePath))
      try {
        const rawData = fs.readFileSync(mockDataFilePath, 'utf-8');
        mockData = JSON.parse(rawData);
      } catch (error) {
        console.error('Error while loading the file:', error);
      }
    else
      console.log(`Mock data file not found: ${mockDataFilePath}`);

    await use(mockData);
  },

  txInspectorTest: ({ page }, use) => {
    use(txInspectorTest(page));
  },

  txAnalyzerMockedTest: ({ page, mockData }, use) => {
    use(txAnalyzerMockedTestEnvironment(page, mockData as unknown as IMockData));
  },

  analyzeAndCompareTransaction: ({ txAnalyzerMockedTest }, use) => {
    use((inputTransaction, expectedResult) => analyzeAndCompareTransaction(txAnalyzerMockedTest, inputTransaction, expectedResult));
  }
});
