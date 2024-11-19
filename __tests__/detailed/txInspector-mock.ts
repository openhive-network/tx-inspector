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

  test('Testcase 1.2.1', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.singleOperationTransaction as ApiTransaction, mockData.singleOperationExpectedResult as IProcessedTransaction);

    expect(isMatching).toBeTruthy();
  });

  test('Testcase 1.2.2', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.multipleOperationsSingleSignatureTransaction as ApiTransaction, mockData.multipleOperationsSingleSignatureExpectedResult as IProcessedTransaction);

    expect(isMatching).toBeTruthy();
  });

  test('Testcase 2.1.1', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.singleOperationTransaction as ApiTransaction, mockData.singleOperationExpectedResult as IProcessedTransaction);

    expect(isMatching).toBeTruthy();
  });

  test('Testcase 2.4', async ({ analyzeAndCompareTransaction, mockData }) => {
    const isMatching = await analyzeAndCompareTransaction(mockData.singleOperationNoAccountAttachedTransaction as ApiTransaction, mockData.singleOperationNoAccountAttachedExpectedResult as IProcessedTransaction);

    expect(isMatching).toBeTruthy();
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
