import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import type { ApiTransaction } from "@hiveio/wax/vite";
import type { IProcessedTransaction } from "../../types/wax";

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on mock data with delegated authority', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Testcase 2.1.2 and 2.3.2', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.singleSignatureTransaction as ApiTransaction, mockData.singleSignatureExpectedResult as IProcessedTransaction);

    expect(isMatching).toBeTruthy();
  });

  test('Testcase 2.3.1', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.singleNestLevelTransaction as ApiTransaction, mockData.singleNestLevelExpectedResult as IProcessedTransaction);

    expect(isMatching).toBeTruthy();
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
