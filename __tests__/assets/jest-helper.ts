/* eslint-disable no-eval */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import fs from 'node:fs';

import { type ConsoleMessage, type Page, test as base } from '@playwright/test';

import './globals';

import type { IWaxOptions } from '@hiveio/wax';

import type { ITxAnalyzerGlobals, ITxInspectorGlobals } from './globals';
import type { IMockData } from './api-mock';

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
  mockData: string;

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
}

const alreadyConsoleLogInitialized = new WeakSet<Page>();

const txInspectorTest = (page: Page): ITxInspectorTest['txInspectorTest'] => {
  const runner = async <R, Args extends any[]>(fn: TTxInspectorTestCallable<R, Args>, ...args: Args): Promise<R> => {
    if (!alreadyConsoleLogInitialized.has(page)) {
      page.on('console', (msg: ConsoleMessage) => {
        console.log('>>', msg.type(), msg.text());
      });

      alreadyConsoleLogInitialized.add(page);
    }

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
  globalFunction: (mockData: IMockData) => Promise<ITxAnalyzerGlobals>,
  mockData: IMockData
): ITxInspectorTest['txAnalyzerMockedTest'] => {
  const runner = async <R, Args extends any[]>(fn: TTxAnalyzerTestCallable<R, Args>, ...args: Args): Promise<R> => {
    if (!alreadyConsoleLogInitialized.has(page)) {
      page.on('console', (msg: ConsoleMessage) => {
        console.log('>>', msg.type(), msg.text());
      });

      alreadyConsoleLogInitialized.add(page);
    }

    await page.goto('http://localhost:8080/__tests__/assets/test.html', { waitUntil: 'load' });

    const webData = await page.evaluate(async ({ args, globalFunction, webFn, mockData }) => {
      eval(`window.webEvalFn = ${webFn};`);
      return (window as Window & typeof globalThis & { webEvalFn: Function }).webEvalFn(await globalThis[globalFunction](mockData), ...args);
    }, { args, globalFunction: globalFunction.name, webFn: fn.toString(), mockData });

    return webData;
  };

  return runner;
};

export const test = base.extend<ITxInspectorTest>({
  customChainId: { chainId: 'beeab0de00000000000000000000000000000000000000000000000000000000' },
  fixtureLevelMockFile: ['', { option: true }],

  mockData: async ({ fixtureLevelMockFile }, use) => {
    const mockDataFilePath = path.resolve(process.cwd(), fixtureLevelMockFile);
    let mockData = {};

    if (fs.existsSync(mockDataFilePath))
      try {
        const rawData = fs.readFileSync(mockDataFilePath, 'utf-8');
        mockData = JSON.parse(rawData);
      } catch (error) {
        console.error('Error while loading the file:', error);
      }
    else
      console.log(`Mock data file not found: ${mockDataFilePath}`);

    await use(mockData as string);
  },

  txInspectorTest: ({ page }, use) => {
    use(txInspectorTest(page));
  },

  txAnalyzerMockedTest: ({ page, mockData }, use) => {
    use(txAnalyzerMockedTestEnvironment(page, createTxAnalyzerTestFor, mockData as unknown as IMockData));
  }
});
