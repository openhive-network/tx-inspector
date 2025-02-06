import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import type { ApiTransaction } from "@hiveio/wax/vite";
import type { IProcessedTransaction } from "../../types/wax";

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on mock data with mixed authorities', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Testcase 3.1', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.activeAuthorityToSatisfyPostingTransaction as ApiTransaction, mockData.activeAuthorityToSatisfyPostingExpectedResult as IProcessedTransaction)

    expect(isMatching).toBeTruthy();
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
