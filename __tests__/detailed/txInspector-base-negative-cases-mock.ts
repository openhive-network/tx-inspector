import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import type { ApiTransaction } from "@hiveio/wax";
import type { IProcessedTransaction } from "../../types/wax";

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on mock data', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Testcase 4.1.1', async ({ analyzeAndCompareTransaction, mockData }) => {
    await expect(
      analyzeAndCompareTransaction(mockData.noOperationsNoSignaturesTransaction as ApiTransaction, mockData.singleOperationExpectedResult as IProcessedTransaction)
    ).rejects.toThrow();
  });

  test('Testcase 4.1.2', async ({ analyzeAndCompareTransaction, mockData }) => {
    await expect(
      analyzeAndCompareTransaction(mockData.noOperationsButSignatureTransaction as ApiTransaction, mockData.singleOperationExpectedResult as IProcessedTransaction)
    ).rejects.toThrow();
  });

  test('Testcase 4.4.1', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.noMatchingSignatureForRequiredAuthorityTransaction as ApiTransaction, mockData.noMatchingSignatureForRequiredAuthorityExpectedResult as IProcessedTransaction);

    expect(isMatching).toBeTruthy();
  });

  test('Testcase 4.4.2', async ({ analyzeAndCompareTransaction, mockData }) => {
      const isMatching = await analyzeAndCompareTransaction(mockData.singleOperationInvalidPublicKeyForRequiredAuthorityTransaction as ApiTransaction, mockData.singleOperationInvalidPublicKeyForRequiredAuthorityExpectedResult as IProcessedTransaction)

      expect(isMatching).toBeTruthy();
  });

  test('Testcase 4.4.3', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.wrongPublicKeyAuthorityLevelTransaction as ApiTransaction, mockData.wrongPublicKeyAuthorityLevelExpectedResult as IProcessedTransaction)

    expect(isMatching).toBeTruthy();
});

  test.afterAll(async () => {
    await browser.close();
  });
});
