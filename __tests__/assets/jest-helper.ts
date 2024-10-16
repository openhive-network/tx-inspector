/* eslint-disable no-console */
/* eslint-disable no-eval */
/* eslint-disable @typescript-eslint/naming-convention */
import { type ConsoleMessage, type Page, test as base } from '@playwright/test';

import './globals';

import type { IWaxOptions } from '@hiveio/wax';
import type { ITxAnalyzerGlobals, ITxInspectorGlobals, ITxInspectorMockGlobals } from './globals';

type TTxInspectorTestCallable<R, Args extends any[]> = (globals: ITxInspectorGlobals, ...args: Args) => (R | Promise<R>);
type TTxInspectorTestMockCallable<R, Args extends any[]> = (globals: ITxInspectorMockGlobals, ...args: Args) => (R | Promise<R>);

type TTxAnalyzerTestCallable<R, Args extends any[]> = (globals: ITxAnalyzerGlobals, ...args: Args) => (R | Promise<R>);

export interface ITxInspectorTest {
  customChainId: IWaxOptions | undefined;
  fixtureLevelMockFile: string;
  /**
   * Runs given function in the browser context and returns the result.
   *
   * Uses real wax API interface to process the transaction.
   *
   * If you want to use the mock data, please use {@link txInspectorMockTest} method instead.
   */
  txInspectorTest: (<R, Args extends any[]>(fn: TTxInspectorTestCallable<R, Args>, ...args: Args) => Promise<R>);

  /**
   * Runs given function in the browser context and returns the result.
   *
   * Uses the mock data to process the transaction.
   *
   * If you want to use the real wax API interface, please use {@link txInspectorTest} method instead.
   */
  txInspectorMockTest: (<R, Args extends any[]>(fn: TTxInspectorTestMockCallable<R, Args>, mockData: any, ...args: Args) => Promise<R>);

  txAnalyzerMockedTest: (<R, Args extends any[]>(fn: TTxAnalyzerTestCallable<R, Args>, ...args: Args) => Promise<R>);
}

const alreadyConsoleLogInitialized = new WeakSet<Page>();

const txInspectorTest = (
  page: Page
): ITxInspectorTest['txInspectorTest'] => {
  const runner = async<R, Args extends any[]> (fn: TTxInspectorTestCallable<R, Args>, ...args: Args): Promise<R> => {
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
  globalFunction: (mockData: any) => Promise<ITxAnalyzerGlobals>,
  fixtureLevelMockFile: string): ITxInspectorTest['txAnalyzerMockedTest'] => {
  const runner = async<R, Args extends any[]>(fn: TTxAnalyzerTestCallable<R, Args>, ...args: Args): Promise<R> => {
    if (!alreadyConsoleLogInitialized.has(page)) {
      page.on('console', (msg: ConsoleMessage) => {
        console.log('>>', msg.type(), msg.text());
      });

      alreadyConsoleLogInitialized.add(page);
    }
    await page.goto('http://localhost:8080/__tests__/assets/test.html', { waitUntil: 'load' });

    if (fixtureLevelMockFile && fixtureLevelMockFile !== '')
      console.log(`Detected custom fixture-level mock data file: ${fixtureLevelMockFile}`);

    const webData = await page.evaluate(async ({ args, globalFunction, webFn, customMockDataFile }) => {
      eval(`window.webEvalFn = ${webFn};`);
      globalThis.fixtureLevelMockFile = customMockDataFile;
      return (window as Window & typeof globalThis & { webEvalFn: Function }).webEvalFn(await globalThis[globalFunction](customMockDataFile), ...args);
    }, { args, globalFunction: globalFunction.name, webFn: fn.toString(), customMockDataFile: globalThis.fixtureLevelMockFile });

    return webData;
  };

  return runner;
};

export const test = base.extend<ITxInspectorTest>({
  customChainId: { chainId: 'beeab0de00000000000000000000000000000000000000000000000000000000' },
  fixtureLevelMockFile: ['', { option: true }],

  txInspectorTest: ({ page }, use) => {
    use(txInspectorTest(page));
  },

  txAnalyzerMockedTest: ({ page, fixtureLevelMockFile }, use) => {
    console.log(`Passed fixture-level mock data file: ${fixtureLevelMockFile}`);
    globalThis.fixtureLevelMockFile = fixtureLevelMockFile;
    use(txAnalyzerMockedTestEnvironment(page, createTxAnalyzerTestFor, fixtureLevelMockFile));
  }
});
