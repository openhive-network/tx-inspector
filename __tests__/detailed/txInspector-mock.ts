import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { multipleOperationSingleSignatureTransaction, singleVoteOperationSingleSignatureTransaction } from "./data";

import { test } from '../assets/jest-helper';

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on mock data', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Should be able to get processed transaction for single operation, single signature, valid transaction', async ({ txAnalyzerMockedTest }) => {
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

  test('Should be able to get processed transaction for multiple operation, single signature, valid transaction', async ({ txAnalyzerMockedTest }) => {
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
    }, multipleOperationSingleSignatureTransaction);

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
            'type': 'comment_operation',
            'value': {
              'author': 'andablackwidow',
              'body': "It should be easy to test - just cut out two lines with `session` in `database::apply_block_extended` (I'm actually assuming that out of order blocks won't reach that routine during sync, but if they do, it would be a source of slowdown).\n\nI'd be surprised if undo sessions were the problem. They are relatively slow and [worthy of optimization](https://gitlab.syncad.com/hive/hive/-/issues/675#note_159293), but in relation to simple transactions, mostly custom_jsons, so their performance is significant when there is many of them, like during block production, reapplication of pending or in extreme stress tests with `colony`+`queen`. During sync we only have one session per block.",
              'json_metadata': '{\"links\":[\"https://gitlab.syncad.com/hive/hive/-/issues/675#note_159293\"],\"app\":\"hiveblog/0.1\"}',
              'parent_author': 'blocktrades',
              'parent_permlink': 'shayan',
              'permlink': 'she0jc',
              'title': '',
            }
          },
          {
            'type': 'comment_options_operation',
            'value': {
              'allow_curation_rewards': true,
              'allow_votes': true,
              'author': 'andablackwidow',
              'max_accepted_payout': {
                'amount': '1000000000',
                'nai': '@@000000013',
                'precision': 3
              },
              'percent_hbd': 10000,
              'permlink': 'she0jc'
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
        requiredAuthoritiesForOperations: [
          {
            'active': {},
            'other': [],
            'owner': {},
            'posting': {}
          },
          {
            'active': {},
            'other': [],
            'owner': {},
            'posting': {}
          }
        ],
        'signatureKeys': ['STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK'],
        'signatures': ['1f4d77e5138520c691f1fdcb794a2056a2f6a28fed02d85e4fcda2768ea852144a7eb141d23e00ec9033ba80f7bae711f61d7a6a85fad80916a8bfe6586f645200'],
        'signeesByKeys': [['andablackwidow']]
      },
      path: [{
        account: ['andablackwidow']
      }]
    });
  });

  test('Should be able to get the authority path for direct sign', async ({ txAnalyzerMockedTest }) => {
    const retVal = await txAnalyzerMockedTest(async ({ authorityPath }, inputTx) => {
        return await authorityPath(inputTx)
    }, singleVoteOperationSingleSignatureTransaction);

    expect(retVal).toEqual([{
        account: ['andablackwidow']
    }]);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
