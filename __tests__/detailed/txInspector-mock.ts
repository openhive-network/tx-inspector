import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { test, type IExpectedResult } from '../assets/jest-helper';
import type { ApiTransaction } from "@hiveio/wax";

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on mock data', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Testcase 1.2.1', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.singleOperationTransaction as ApiTransaction, mockData.singleOperationExpectedResult as IExpectedResult);

    expect(isMatching).toBeTruthy();
  });

  test('Testcase 1.2.2', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.multipleOperationsSingleSignatureTransaction as ApiTransaction, mockData.multipleOperationsSingleSignatureExpectedResult as IExpectedResult);

    expect(isMatching).toBeTruthy();
  });

  test('Testcase 2.1.1', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.singleOperationTransaction as ApiTransaction, mockData.singleOperationExpectedResult as IExpectedResult);

    expect(isMatching).toBeTruthy();
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
