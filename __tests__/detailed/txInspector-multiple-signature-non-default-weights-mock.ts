import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import type { ApiTransaction } from "@hiveio/wax";
import type { IProcessedTransaction } from "../../types/wax";

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on mock data with non default weights', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Testcase 2.2.2.1', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.multipleOperationMultipleSignatureTransaction as ApiTransaction, mockData.multipleOperationMultipleSignatureExpectedResult as IProcessedTransaction);

    expect(isMatching).toBeTruthy();
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
