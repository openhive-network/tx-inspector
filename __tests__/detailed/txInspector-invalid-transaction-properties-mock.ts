import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import type { ApiTransaction } from "@hiveio/wax";
import type { IProcessedTransaction } from "../../types/wax";

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on mock data with expiration time from far future', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Testcase 4.2.1', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.expirationTimeFromFarFutureTransaction as ApiTransaction, mockData.expirationTimeFromFarFutureExpectedResult as IProcessedTransaction)

    expect(isMatching).toBeTruthy();
  });

  test('Testcase 4.3', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.invalidTaposTransaction as ApiTransaction, mockData.invalidTaposExpectedResult as IProcessedTransaction)

    expect(isMatching).toBeTruthy();
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
