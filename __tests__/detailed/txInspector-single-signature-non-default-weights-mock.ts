import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { singleVoteOperationSingleSignatureTransaction } from "./data";

import { test } from '../assets/jest-helper';

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on mock data with non default weights', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Should be able to get processed transaction for single operation, single signature, non default weights transaction', async ({ txAnalyzerMockedTest }) => {
    const retVal = await txAnalyzerMockedTest(async ({ analyzer, authorityPath }, inputTx) => {
      const processingResults = await analyzer.analyzeTransaction(inputTx);
      return {
        inspectorResults: {
          signatures: processingResults.signatures,
          signatureKeys: processingResults.signatureKeys,
          requiredAuthorities: processingResults.requiredAuthorities,
          requiredAuthoritiesForOperations: processingResults.requiredAuthoritiesForOperations,
          authorityType: processingResults.authorityType,
          operations: processingResults.operations,
          signeesByKeys: processingResults.signeesByKeys,
          isValid: processingResults.isValid,
          packType: processingResults.packType
        },
        path: await authorityPath(inputTx)
      };
    }, singleVoteOperationSingleSignatureTransaction);

    expect(retVal).toEqual({
      inspectorResults: {
        authorityType: [
          {
            accounts: {},
            level: 'Active'
          }
        ],
        isValid: true,
        operations: [
          {
            'type': 'transfer_operation',
            'value': {
              'amount': {
                'amount': '20000',
                'nai': '@@000000013',
                'precision': 3
              },
              'from': 'andablackwidow',
              'memo': '',
              'to': 'abw.pay'
            }
          }
        ],
        packType: 'legacy',
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
        'signatureKeys': ['STM5bAX9A3CR7CeYRP2Zv6doCQMwiYTfViXqj6wqafpUZwq1yFbxh'],
        'signatures': ['204e6e9b49d7aa38c5ed10e48c0f6371fba4b018c450590b6e4025e3e96ed3e30c57eb05d545ea5319825c859a9752487c25c7e5086f7971675e55037f922e5295'],
        'signeesByKeys': [['andablackwidow']]
      },
      path: [{
        account: ['andablackwidow']
      }]
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
