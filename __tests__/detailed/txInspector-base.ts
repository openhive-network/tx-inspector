import { type ChromiumBrowser, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { incorrectSingleOperationSingleSignatureTransaction, multipleOperationMultipleSignatureTransaction, multipleOperationMultipleSignatureTransactionId, singleOperationSingleSignatureTransaction, singleOperationSingleSignatureTransactionId } from './data';

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on wax library', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Should analyze a correct single operation single signature transaction by its id', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ txInspector }, singleOperationSingleSignatureTransactionId) => {
      const tx = await txInspector.processTransactionId(singleOperationSingleSignatureTransactionId);

      return {
        authorityType: tx.authorityType[0],
        signatures: tx.signatures,
        signatureKeys: tx.signatureKeys,
        operations: tx.operations,
        signeesByKeys: tx.signeesByKeys,
        isValid: tx.isValid,
        packType: tx.packType,
        transactionId: tx.transactionId,
        sigDigest: tx.sigDigest
      }
    }, singleOperationSingleSignatureTransactionId);

    expect(retVal).toEqual({
      authorityType: { level: 'Active', accounts: {} },
      signatures: ['203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07'],
      signatureKeys: ['STM7jDAdjyLYgqhyCwSafVzNGN4PLBGWrYB9uJun4AitZA8TERgif'],
      operations: [
        {
          type: 'transfer_operation',
          value: {
            from: 'splinterboost',
            to: 'bluehy20',
            amount: {
              nai: '@@000000021',
              amount: '14',
              precision: 3
            },
            memo: 'Thank you for delegating to Splinterboost here is your daily HIVE payout!'
          }
        }
      ],
      signeesByKeys: [['splinterboost']],
      isValid: true,
      packType: 'legacy',
      transactionId: 'da9602787693edccdafa1e7325502e0bb14453d1',
      sigDigest: '3b61fc6ece0de73ed01897bb3fa00c74d32b968843e4b79fe66d0c5e2c8ec2da'
    });
  });

  test('Should analyze a correct single operation single signature transaction by its json', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ txInspector }, singleOperationSingleSignatureTransaction) => {
      const tx = await txInspector.processTransaction(singleOperationSingleSignatureTransaction);

      return {
        authorityType: tx.authorityType[0],
        signatures: tx.signatures,
        signatureKeys: tx.signatureKeys,
        operations: tx.operations,
        signeesByKeys: tx.signeesByKeys,
        isValid: tx.isValid,
        packType: tx.packType,
        transactionId: tx.transactionId,
        sigDigest: tx.sigDigest
      }
    }, singleOperationSingleSignatureTransaction);

    expect(retVal).toEqual({
      authorityType: { level: 'Active', accounts: {} },
      signatures: ['203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07'],
      signatureKeys: ['STM7jDAdjyLYgqhyCwSafVzNGN4PLBGWrYB9uJun4AitZA8TERgif'],
      operations: [
        {
          type: 'transfer_operation',
          value: {
            from: 'splinterboost',
            to: 'bluehy20',
            amount: {
              nai: '@@000000021',
              amount: '14',
              precision: 3
            },
            memo: 'Thank you for delegating to Splinterboost here is your daily HIVE payout!'
          }
        }
      ],
      signeesByKeys: [['splinterboost']],
      isValid: true,
      packType: 'legacy',
      transactionId: 'da9602787693edccdafa1e7325502e0bb14453d1',
      sigDigest: '3b61fc6ece0de73ed01897bb3fa00c74d32b968843e4b79fe66d0c5e2c8ec2da'
    });
  });

  test('Should analyze a correct multiple operation multiple signature transaction by its json', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ txInspector }, multipleOperationMultipleSignatureTransaction) => {
      const tx = await txInspector.processTransaction(multipleOperationMultipleSignatureTransaction);

      return {
        signatures: tx.signatures,
        signatureKeys: tx.signatureKeys,
        operations: tx.operations,
        isValid: tx.isValid,
      }
    }, multipleOperationMultipleSignatureTransaction);

    expect(retVal).toEqual({
      signatures: [
        '1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726',
        '20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f',
        '20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1',
        '2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a',
        '205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5'
      ],
      signatureKeys: [
        'STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP',
        'STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd',
        'STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK',
        'STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR',
        'STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43'
      ],
      operations: [
        {
          type: 'vote_operation',
          value: {
            voter: 'ecency',
            author: 'el-panal',
            weight: 100,
            permlink: 'el-panal-presentacion-de-autores-destacados-dia31072024'
          }
        },
        {
          type: 'vote_operation',
          value: {
            voter: 'ecency.stats',
            author: 'el-panal',
            weight: 100,
            permlink: 'el-panal-presentacion-de-autores-destacados-dia31072024'
          }
        },
        {
          type: 'vote_operation',
          value: {
            voter: 'esteem.app',
            author: 'el-panal',
            weight: 100,
            permlink: 'el-panal-presentacion-de-autores-destacados-dia31072024'
          }
        },
        {
          type: 'vote_operation',
          value: {
            voter: 'good-karma',
            author: 'el-panal',
            weight: 100,
            permlink: 'el-panal-presentacion-de-autores-destacados-dia31072024'
          }
        },
        {
          type: 'vote_operation',
          value: {
            voter: 'esteemapp',
            author: 'el-panal',
            weight: 100,
            permlink: 'el-panal-presentacion-de-autores-destacados-dia31072024'
          }
        }
      ],
      isValid: true
    });
  });

  test('Should analyze a correct multiple operation multiple signature transaction by its id', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ txInspector }, multipleOperationMultipleSignatureTransactionId) => {
      const tx = await txInspector.processTransactionId(multipleOperationMultipleSignatureTransactionId);

      return {
        signatures: tx.signatures,
        signatureKeys: tx.signatureKeys,
        operations: tx.operations,
        isValid: tx.isValid,
      }
    }, multipleOperationMultipleSignatureTransactionId);

    expect(retVal).toEqual({
      signatures: [
        '1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726',
        '20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f',
        '20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1',
        '2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a',
        '205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5'
      ],
      signatureKeys: [
        'STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP',
        'STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd',
        'STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK',
        'STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR',
        'STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43'
      ],
      operations: [
        {
          type: 'vote_operation',
          value: {
            voter: 'ecency',
            author: 'el-panal',
            weight: 100,
            permlink: 'el-panal-presentacion-de-autores-destacados-dia31072024'
          }
        },
        {
          type: 'vote_operation',
          value: {
            voter: 'ecency.stats',
            author: 'el-panal',
            weight: 100,
            permlink: 'el-panal-presentacion-de-autores-destacados-dia31072024'
          }
        },
        {
          type: 'vote_operation',
          value: {
            voter: 'esteem.app',
            author: 'el-panal',
            weight: 100,
            permlink: 'el-panal-presentacion-de-autores-destacados-dia31072024'
          }
        },
        {
          type: 'vote_operation',
          value: {
            voter: 'good-karma',
            author: 'el-panal',
            weight: 100,
            permlink: 'el-panal-presentacion-de-autores-destacados-dia31072024'
          }
        },
        {
          type: 'vote_operation',
          value: {
            voter: 'esteemapp',
            author: 'el-panal',
            weight: 100,
            permlink: 'el-panal-presentacion-de-autores-destacados-dia31072024'
          }
        }
      ],
      isValid: true
    });
  });

  test('Should analyze a incorrect single operation single signature transaction by its json', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ txInspector }, incorrectSingleOperationSingleSignatureTransaction) => {
      const tx = await txInspector.processTransaction(incorrectSingleOperationSingleSignatureTransaction);

      return {
        authorityType: tx.authorityType[0],
        signatures: tx.signatures,
        signatureKeys: tx.signatureKeys,
        operations: tx.operations,
        signeesByKeys: tx.signeesByKeys,
        isValid: tx.isValid,
        packType: tx.packType,
        transactionId: tx.transactionId,
        sigDigest: tx.sigDigest
      }
    }, incorrectSingleOperationSingleSignatureTransaction);

    expect(retVal).toEqual({
      authorityType: { level: 'Active', accounts: {} },
      signatures: ['203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ff'], // Incorrect signature
      signatureKeys: ['STM62KzA9tPSLczvBfKg4F7BCjadXdXYoCTgALYTNgJfRDPPNgRmh'], // Incorrect key because of the incorrect signature
      operations: [
        {
          type: 'transfer_operation',
          value: {
            from: 'splinterboost',
            to: 'bluehy20',
            amount: {
              nai: '@@000000021',
              amount: '14',
              precision: 3
            },
            memo: 'Thank you for delegating to Splinterboost here is your daily HIVE payout!'
          }
        }
      ],
      signeesByKeys: [[]], // No signees because of the incorrect public key
      isValid: false,
      packType: 'unknown',
      transactionId: {
        hf26: '1da45e713070f41ea92bfd7594d3e215036617ac',
        legacy: 'da9602787693edccdafa1e7325502e0bb14453d1'
      },
      sigDigest: {
        hf26: '4a87e37d0b4642815946102ad85f9da6c6a5795c554cb2d7a7f0f782d7d9fed1',
        legacy: '3b61fc6ece0de73ed01897bb3fa00c74d32b968843e4b79fe66d0c5e2c8ec2da'
      }
    });
  });

  test('Should be able to change the chain id', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ txInspector }) => {
      await txInspector.changeConfig('customChainId', 'https://api.hive.blog/');

      return txInspector.config.chainId;
    });

    expect(retVal).toEqual('customChainId');
  });

  test('Should be able to change the api endpoint', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ txInspector }) => {
      await txInspector.changeConfig('beeab0de00000000000000000000000000000000000000000000000000000000', 'https://api.test.com');

      return txInspector.config.apiEndpoint;
    });

    expect(retVal).toEqual('https://api.test.com');
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
