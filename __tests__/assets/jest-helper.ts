/* eslint-disable no-eval */
/* eslint-disable @typescript-eslint/naming-convention */
import { type ConsoleMessage, type Page, test as base } from '@playwright/test';

import './globals';

import type { IWaxOptions } from '@hiveio/wax';
import type { ITxInspectorGlobals, ITxInspectorMockGlobals } from './globals';

type TTxInspectorTestCallable<R, Args extends any[]> = (globals: ITxInspectorGlobals, ...args: Args) => (R | Promise<R>);
type TTxInspectorTestMockCallable<R, Args extends any[]> = (globals: ITxInspectorMockGlobals, ...args: Args) => (R | Promise<R>);

export interface ITxInspectorTest {
  customChainId: IWaxOptions | undefined;

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
}

const alreadyConsoleLogInitialized = new WeakSet<Page>();

const txInspectorTest = <GlobalType extends ITxInspectorGlobals | ITxInspectorMockGlobals> (
  page: Page,
  globalFunction: (mockData: any) => Promise<GlobalType>
): ITxInspectorTest[GlobalType extends ITxInspectorGlobals ? 'txInspectorTest' : 'txInspectorMockTest'] => {
  const runner = async<R, Args extends any[]> (mockData: GlobalType extends ITxInspectorGlobals ? undefined : any, fn: GlobalType extends ITxInspectorGlobals ? TTxInspectorTestCallable<R, Args> : TTxInspectorTestMockCallable<R, Args>, ...args: Args): Promise<R> => {
    if (!alreadyConsoleLogInitialized.has(page)) {
      page.on('console', (msg: ConsoleMessage) => {
        // eslint-disable-next-line no-console
        console.log('>>', msg.type(), msg.text());
      });

      alreadyConsoleLogInitialized.add(page);
    }
    await page.goto('http://localhost:8080/__tests__/assets/test.html', { waitUntil: 'load' });

    const webData = await page.evaluate(async ({ args, globalFunction, webFn, customChainId, mockData }) => {
      eval(`window.webEvalFn = ${webFn};`);
      globalThis.customChainId = customChainId;

      return (window as Window & typeof globalThis & { webEvalFn: Function }).webEvalFn(await globalThis[globalFunction](mockData), ...args);
    }, { args, globalFunction: globalFunction.name, webFn: fn.toString(), customChainId: globalThis.customChainId, mockData });

    return webData;
  };

  const using = function<R, Args extends any[]> (mockData: GlobalType extends ITxInspectorGlobals ? undefined : any, fn: TTxInspectorTestCallable<R, Args>, ...args: Args) {
    return runner.bind(undefined, mockData)(fn as any, ...args);
  };

  return using as ITxInspectorTest[GlobalType extends ITxInspectorGlobals ? 'txInspectorTest' : 'txInspectorMockTest'];
};

export const test = base.extend<ITxInspectorTest>({
  customChainId: { chainId: 'beeab0de00000000000000000000000000000000000000000000000000000000' },

  txInspectorTest: ({ page }, use) => {
    use(txInspectorTest(page, createTxInspectorTestFor));
  }
});

export const mockTest = base.extend<ITxInspectorTest>({
  txInspectorMockTest: ({ page }, use) => {
    use(txInspectorTest(page, createTxInspectorMockTestFor));
  }
});
