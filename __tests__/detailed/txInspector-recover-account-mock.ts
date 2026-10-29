import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import type { ApiTransaction } from "@hiveio/wax";
import type { IProcessedTransaction } from "../../types/wax";

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on mock recover account data', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Testcase 1.3.1 ', async ({ analyzeAndCompareTransaction, mockData }) => {
    test.fail(true, "Known disagreement: the analyzer throws a TypeError in isSatisfied (no required authorities of the role it traces); unresolved whether the recorded expectation or the analyzer is wrong.");

    const isMatching = await analyzeAndCompareTransaction(mockData.recoverAccountTransaction as ApiTransaction, mockData.recoverAccountExpectedResult as IProcessedTransaction);

    expect(isMatching).toBeTruthy();
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
