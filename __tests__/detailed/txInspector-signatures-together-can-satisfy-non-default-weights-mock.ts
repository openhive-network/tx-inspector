import { chromium, type ChromiumBrowser } from "playwright";
import { expect } from '@playwright/test';

import { multipleOperationMultipleSignatureTransaction } from "./data";

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
    }, multipleOperationMultipleSignatureTransaction);

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
              'author': 'el-panal',
              'permlink': 'el-panal-presentacion-de-autores-destacados-dia31072024',
              'voter': 'ecency',
              'weight': 100
            }
          },
          {
            'type': 'vote_operation',
            'value': {
              'author': 'el-panal',
              'permlink': 'el-panal-presentacion-de-autores-destacados-dia31072024',
              'voter': 'ecency.stats',
              'weight': 100
            }
          },
          {
            'type': 'vote_operation',
            'value': {
              'author': 'el-panal',
              'permlink': 'el-panal-presentacion-de-autores-destacados-dia31072024',
              'voter': 'esteem.app',
              'weight': 100
            }
          },
          {
            'type': 'vote_operation',
            'value': {
              'author': 'el-panal',
              'permlink': 'el-panal-presentacion-de-autores-destacados-dia31072024',
              'voter': 'good-karma',
              'weight': 100
            }
          },
          {
            'type': 'vote_operation',
            'value': {
              'author': 'el-panal',
              'permlink': 'el-panal-presentacion-de-autores-destacados-dia31072024',
              'voter': 'esteemapp',
              'weight': 100
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
          },
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
          },
          {
            'active': {},
            'other': [],
            'owner': {},
            'posting': {}
          }
        ],
        'signatureKeys': [
          'STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP',
          'STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd',
          'STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK',
          'STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR',
          'STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43'
        ],
        'signatures': [
          '1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726',
          '20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f',
          '20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1',
          '2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a',
          '205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5'
        ],
        'signeesByKeys': [[
          ['esteemapp'],
          ['ecency.stats'],
          ['esteem.app'],
          ['good-karma'],
          ['ecency']
        ]]
      },
      path: [{
        account: [
          'ecency',
          'ecency.stats',
          'esteem.app',
          'esteemapp',
          'good-karma'
        ]
      }]
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
