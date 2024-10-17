import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { claimAccountOperationTransaction } from "./data";

import { test } from '../assets/jest-helper';

let browser!: ChromiumBrowser;

mockTest.describe('transaction inspector tests based on mock data', () => {
  mockTest.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Should be able to use mocked tests for TxAnalyzer class', async ({ txAnalyzerMockedTest }) => {
    const retVal = await txAnalyzerMockedTest(async ({ analyzer }, inputTx) => {
      const processingResults = await analyzer.analyzeTransaction(inputTx);
      return {
        signatures: processingResults.signatures,
        signatureKeys: processingResults.signatureKeys,
        requiredAuthorities: processingResults.requiredAuthorities,
        requiredAuthoritiesForOperations: processingResults.requiredAuthoritiesForOperations,
        authorityType: processingResults.authorityType,
        operations: processingResults.operations,
        signeesByKeys: processingResults.signeesByKeys,
        isValid: processingResults.isValid,
        packType: processingResults.packType
      };
    }, claimAccountOperationTransaction);

    expect(retVal).toEqual({
      authorityType: [
        {
          accounts: {},
          level: 'Active'
        }
      ],
      isValid: true,
      operations: [
        {
          'type': 'claim_account_operation',
          'value': {
            'creator': 'gtg',
            'fee': {
              'amount': '0',
              'nai': '@@000000021',
              'precision': 3
            }
          }
        }
      ],
      packType: 'hf26',
      requiredAuthorities: {
        'active': {},
        'other': [],
        'owner': {},
        'posting': {}
      },
      requiredAuthoritiesForOperations: {
        'active': {},
        'other': [],
        'owner': {},
        'posting': {}
      },
      'signatureKeys': ['STM5m8TX42HisYi4Mq1TjUVSwzfczkmNf69GzLr8tcYKTcYtVW269'],
      'signatures': ['1f0e6420c3cf4f084da52d37ed010909fef7ab12596ee47276ce62b1b1ffb4b18c0958c466654aaf77681661516ddef688fd5289d131198d123e5259447aee2c5c'],
      'signeesByKeys': [['gtg', 'initminer']]
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
