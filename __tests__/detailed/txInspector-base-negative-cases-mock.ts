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

  test('Testcase 4.1.1', async ({ analyzeAndCompareTransaction, mockData }) => {
    await expect(
      analyzeAndCompareTransaction(mockData.noOperationsNoSignaturesTransaction as ApiTransaction, mockData.singleOperationExpectedResult as IExpectedResult)
    ).rejects.toThrow();
  });

  test('Testcase 4.1.2', async ({ analyzeAndCompareTransaction, mockData }) => {
    await expect(
      analyzeAndCompareTransaction(mockData.noOperationsButSignatureTransaction as ApiTransaction, mockData.singleOperationExpectedResult as IExpectedResult)
    ).rejects.toThrow();
  });

  test('Testcase 4.4.2', async ({ analyzeAndCompareTransaction, mockData }) => {
      const isMatching = await analyzeAndCompareTransaction(mockData.singleOperationInvalidPublicKeyForRequiredAuthorityTransaction as ApiTransaction, mockData.singleOperationInvalidPublicKeyForRequiredAuthorityExpectedResult as IExpectedResult)

      expect(isMatching).toBeTruthy();
  });

  test('Testcase 4.4.3', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.wrongPublicKeyAuthorityLevelTransaction as ApiTransaction, mockData.wrongPublicKeyAuthorityLevelExpectedResult as IExpectedResult)

    expect(isMatching).toBeTruthy();
});

  test.afterAll(async () => {
    await browser.close();
  });
});
