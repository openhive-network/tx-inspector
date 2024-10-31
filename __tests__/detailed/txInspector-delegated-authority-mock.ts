import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { singleOperationSingleSignatureDelegatedAuthorityTransaction } from "./data";

import { test } from '../assets/jest-helper';

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on mock data with delegated authority', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Should be able to get processed transaction for single operation, single signature, delegated authority transaction', async ({ txAnalyzerMockedTest }) => {
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
    }, singleOperationSingleSignatureDelegatedAuthorityTransaction);

    expect(retVal).toEqual({
      inspectorResults: {
        authorityType: [
          {
            accounts: {},
            level: 'Posting'
          }
        ],
        isValid: true,
        operations: [
          {
            'type': 'vote_operation',
            'value': {
              'author': 'mamaemigrante',
              'permlink': 'buscando-ollas-nuevas-para-mi-cocina-looking-for-new-pots-and-pans-for-my-kitchen',
              'voter': 'tattooworld',
              'weight': 10000
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
        'signatureKeys': ['STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF'],
        'signatures': ['20543c6e9e5ea2acfb94e9c5cd6672f302d067b62a4c71832dcaec7caf5e83a83b45ae76c55e3f51f8eb254b460a0585e7f911a93d6e5a58522429b7a4678dc22e'],
        'signeesByKeys': [['steemauto']]
      },
      path: [{
        account: [''] // TODO: Authority path is not working properly for delegated authority tests
      }]
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
