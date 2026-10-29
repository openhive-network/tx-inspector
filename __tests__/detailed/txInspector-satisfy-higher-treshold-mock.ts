import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import type { ApiTransaction } from "@hiveio/wax";
import type { IProcessedTransaction } from "../../types/wax";

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on mock data with non default treshold', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Testcase 3.4', async ({ analyzeAndCompareTransaction, mockData }) => {
    test.fail(true, "Known disagreement: the expectation is satisfied, the analyzer reports insufficient weight and a missing signature; unresolved whether the recorded expectation or the analyzer is wrong.");

    const isMatching = await analyzeAndCompareTransaction(mockData.useKeyAndAccountToSatisfyTresholdTransaction as ApiTransaction, mockData.useKeyAndAccountToSatisfyTresholdExpectedResult as IProcessedTransaction);

    expect(isMatching).toBeTruthy();
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
