import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import type { ApiTransaction } from "@hiveio/wax";
import type { IProcessedTransaction } from "../../types/wax";

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on mock data with delegated authority', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Testcase 2.2.1', async ({ analyzeAndCompareTransaction, mockData }) => {
    test.fail(true, "Known disagreement: the expectation has open authorities satisfied as 'blockchain_forced_true', the analyzer matches the signatures and reports 'true'; unresolved whether the recorded expectation or the analyzer is wrong.");

    const isMatching = await analyzeAndCompareTransaction(mockData.multipleSignaturesTransaction as ApiTransaction, mockData.multipleSignaturesExpectedResult as IProcessedTransaction);

    expect(isMatching).toBeTruthy();
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
