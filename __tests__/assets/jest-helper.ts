/* eslint-disable no-eval */
/* eslint-disable @typescript-eslint/naming-convention */
import { type ConsoleMessage, type Page, test as base } from '@playwright/test';

import './globals';

import type { IWaxOptions } from '@hiveio/wax';
import type { ITxInspectorGlobals } from './globals';

type TTxInspectorTestCallable<R, Args extends any[]> = (globals: ITxInspectorGlobals, ...args: Args) => (R | Promise<R>);

export interface ITxInspectorTest {
  customChainId: IWaxOptions | undefined;

  txInspectorTest: (<R, Args extends any[]>(fn: TTxInspectorTestCallable<R, Args>, ...args: Args) => Promise<R>);
}

const alreadyConsoleLogInitialized = new WeakSet<Page>();

const txInspectorTest = (
  page: Page
): ITxInspectorTest['txInspectorTest'] => {
  const runner = async<R, Args extends any[]> (fn: TTxInspectorTestCallable<R, Args>, ...args: Args): Promise<R> => {
    if (!alreadyConsoleLogInitialized.has(page)) {
      page.on('console', (msg: ConsoleMessage) => {
        // eslint-disable-next-line no-console
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

  const using = function<R, Args extends any[]> (fn: TTxInspectorTestCallable<R, Args>, ...args: Args) {
    return runner.bind(undefined)(fn as any, ...args);
  };

  return using as ITxInspectorTest['txInspectorTest'];
};

export const test = base.extend<ITxInspectorTest>({
  customChainId: { chainId: 'beeab0de00000000000000000000000000000000000000000000000000000000' },

  txInspectorTest: ({ page, customChainId }, use) => {
    globalThis.customChainId = customChainId;
    use(txInspectorTest(page));
  }
});
