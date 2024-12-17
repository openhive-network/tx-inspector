import { type ChromiumBrowser, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { incorrectSingleOperationSingleSignatureTransaction, multipleOperationMultipleSignatureTransaction, multipleOperationMultipleSignatureTransactionBinary, multipleOperationMultipleSignatureTransactionId, singleOperationSingleSignatureTransaction, singleOperationSingleSignatureTransactionBinary, singleOperationSingleSignatureTransactionId } from './data';

let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on wax library', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test('Should analyze a correct single operation single signature transaction by its id', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ inspectorEngine }, singleOperationSingleSignatureTransactionId) => {
      const tx = await inspectorEngine.processTransactionId(singleOperationSingleSignatureTransactionId);

      return {
        signatureData: tx.signatureData,
        transactionData: tx.transactionData,
        requiredAuthoritiesData: tx.requiredAuthoritiesData,
        transactionBodyData: tx.transactionBodyData,
        transactionOtherData: { isValid: tx.transactionOtherData.isValid, signeesByKeys: tx.transactionOtherData.signeesByKeys }
      };
    }, singleOperationSingleSignatureTransactionId);

    expect(retVal).toEqual({
      "signatureData": [
        {
          "signature": "203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07",
          "packType": "legacy",
          "publicKey": "STM7jDAdjyLYgqhyCwSafVzNGN4PLBGWrYB9uJun4AitZA8TERgif",
          "authorityPath": [
            {
              "account": [
                "splinterboost"
              ]
            }
          ]
        }
      ],
      "transactionData": {
        "id": "da9602787693edccdafa1e7325502e0bb14453d1",
        "sigDigest": "3b61fc6ece0de73ed01897bb3fa00c74d32b968843e4b79fe66d0c5e2c8ec2da",
        "tapos": {
          "refBlockNum": 33561,
          "refBlockPrefix": 2922397352
        },
        "expirationTime": "2024-09-20T12:16:45"
      },
      "requiredAuthoritiesData": [
        {
          "matchingSignature": "203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07",
          "authorityAccount": "splinterboost",
          "authorityType": "Active",
          "isSatisfied": "true"
        }
      ],
      "transactionBodyData": [
        {
          "authorityAccount": "splinterboost",
          "authorityType": "Active",
          "isSatisfied": "true",
          "operationType": "transfer_operation",
          "operationContent": {
            "from": "splinterboost",
            "to": "bluehy20",
            "amount": {
              "amount": "14",
              "precision": 3,
              "nai": "@@000000021"
            },
            "memo": "Thank you for delegating to Splinterboost here is your daily HIVE payout!"
          }
        }
      ],
      "transactionOtherData": {
        "isValid": true,
        "signeesByKeys": [
          [
            "splinterboost"
          ]
        ]
      }
    });
  });

  test('Should analyze a correct single operation single signature transaction by its binary', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ inspectorEngine }, singleOperationSingleSignatureTransactionBinary) => {
      const tx = await inspectorEngine.processTransactionBinary(singleOperationSingleSignatureTransactionBinary);

      return {
        signatureData: tx.signatureData,
        transactionData: tx.transactionData,
        requiredAuthoritiesData: tx.requiredAuthoritiesData,
        transactionBodyData: tx.transactionBodyData,
        transactionOtherData: { isValid: tx.transactionOtherData.isValid, signeesByKeys: tx.transactionOtherData.signeesByKeys }
      };
    }, singleOperationSingleSignatureTransactionBinary);

    expect(retVal).toEqual({
      "signatureData": [
        {
          "signature": "203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07",
          "packType": "legacy",
          "publicKey": "STM7jDAdjyLYgqhyCwSafVzNGN4PLBGWrYB9uJun4AitZA8TERgif",
          "authorityPath": [
            {
              "account": [
                "splinterboost"
              ]
            }
          ]
        }
      ],
      "transactionData": {
        "id": "da9602787693edccdafa1e7325502e0bb14453d1",
        "sigDigest": "3b61fc6ece0de73ed01897bb3fa00c74d32b968843e4b79fe66d0c5e2c8ec2da",
        "tapos": {
          "refBlockNum": 33561,
          "refBlockPrefix": 2922397352
        },
        "expirationTime": "2024-09-20T12:16:45"
      },
      "requiredAuthoritiesData": [
        {
          "matchingSignature": "203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07",
          "authorityAccount": "splinterboost",
          "authorityType": "Active",
          "isSatisfied": "true"
        }
      ],
      "transactionBodyData": [
        {
          "authorityAccount": "splinterboost",
          "authorityType": "Active",
          "isSatisfied": "true",
          "operationType": "transfer_operation",
          "operationContent": {
            "from": "splinterboost",
            "to": "bluehy20",
            "amount": {
              "amount": "14",
              "precision": 3,
              "nai": "@@000000021"
            },
            "memo": "Thank you for delegating to Splinterboost here is your daily HIVE payout!"
          }
        }
      ],
      "transactionOtherData": {
        "isValid": true,
        "signeesByKeys": [
          [
            "splinterboost"
          ]
        ]
      }
    });
  });

  test('Should analyze a correct single operation single signature transaction by its json', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ inspectorEngine }, singleOperationSingleSignatureTransaction) => {
      const tx = await inspectorEngine.processTransaction(singleOperationSingleSignatureTransaction);

      return {
        signatureData: tx.signatureData,
        transactionData: tx.transactionData,
        requiredAuthoritiesData: tx.requiredAuthoritiesData,
        transactionBodyData: tx.transactionBodyData,
        transactionOtherData: { isValid: tx.transactionOtherData.isValid, signeesByKeys: tx.transactionOtherData.signeesByKeys }
      };
    }, singleOperationSingleSignatureTransaction);

    expect(retVal).toEqual({
      "signatureData": [
        {
          "signature": "203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07",
          "packType": "legacy",
          "publicKey": "STM7jDAdjyLYgqhyCwSafVzNGN4PLBGWrYB9uJun4AitZA8TERgif",
          "authorityPath": [
            {
              "account": [
                "splinterboost"
              ]
            }
          ]
        }
      ],
      "transactionData": {
        "id": "da9602787693edccdafa1e7325502e0bb14453d1",
        "sigDigest": "3b61fc6ece0de73ed01897bb3fa00c74d32b968843e4b79fe66d0c5e2c8ec2da",
        "tapos": {
          "refBlockNum": 33561,
          "refBlockPrefix": 2922397352
        },
        "expirationTime": "2024-09-20T12:16:45"
      },
      "requiredAuthoritiesData": [
        {
          "matchingSignature": "203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07",
          "authorityAccount": "splinterboost",
          "authorityType": "Active",
          "isSatisfied": "true"
        }
      ],
      "transactionBodyData": [
        {
          "authorityAccount": "splinterboost",
          "authorityType": "Active",
          "isSatisfied": "true",
          "operationType": "transfer_operation",
          "operationContent": {
            "from": "splinterboost",
            "to": "bluehy20",
            "amount": {
              "amount": "14",
              "precision": 3,
              "nai": "@@000000021"
            },
            "memo": "Thank you for delegating to Splinterboost here is your daily HIVE payout!"
          }
        }
      ],
      "transactionOtherData": {
        "isValid": true,
        "signeesByKeys": [
          [
            "splinterboost"
          ]
        ]
      }
    });
  });

  test('Should analyze a correct multiple operation multiple signature transaction by its json', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ inspectorEngine }, multipleOperationMultipleSignatureTransaction) => {
      const tx = await inspectorEngine.processTransaction(multipleOperationMultipleSignatureTransaction);

      return {
        signatureData: tx.signatureData,
        transactionData: tx.transactionData,
        requiredAuthoritiesData: tx.requiredAuthoritiesData,
        transactionBodyData: tx.transactionBodyData,
        transactionOtherData: { isValid: tx.transactionOtherData.isValid, signeesByKeys: tx.transactionOtherData.signeesByKeys }
      };
    }, multipleOperationMultipleSignatureTransaction);

    expect(retVal).toEqual({
      "signatureData": [
        {
          "signature": "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
          "packType": "hf26",
          "publicKey": "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        },
        {
          "signature": "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
          "packType": "hf26",
          "publicKey": "STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        },
        {
          "signature": "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
          "packType": "hf26",
          "publicKey": "STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        },
        {
          "signature": "2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a",
          "packType": "hf26",
          "publicKey": "STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        },
        {
          "signature": "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5",
          "packType": "hf26",
          "publicKey": "STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        }
      ],
      "transactionData": {
        "id": "a7efc7be69861fdcdc39712e532beb8ddc701f03",
        "sigDigest": "acf004c792cd6196e0514f56d97bd8148b81872fbe12578386f4163971172f59",
        "tapos": {
          "refBlockNum": 808,
          "refBlockPrefix": 1359279161
        },
        "expirationTime": "2024-08-02T12:09:03"
      },
      "requiredAuthoritiesData": [
        {
          "matchingSignature": "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5",
          "authorityAccount": "ecency",
          "authorityType": "Posting",
          "isSatisfied": "true"
        },
        {
          "matchingSignature": "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
          "authorityAccount": "ecency.stats",
          "authorityType": "Posting",
          "isSatisfied": "true"
        },
        {
          "matchingSignature": "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
          "authorityAccount": "esteem.app",
          "authorityType": "Posting",
          "isSatisfied": "true"
        },
        {
          "matchingSignature": "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
          "authorityAccount": "esteemapp",
          "authorityType": "Posting",
          "isSatisfied": "true"
        },
        {
          "matchingSignature": "2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a",
          "authorityAccount": "good-karma",
          "authorityType": "Posting",
          "isSatisfied": "true"
        }
      ],
      "transactionBodyData": [
        {
          "authorityAccount": "ecency",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "ecency",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        },
        {
          "authorityAccount": "ecency.stats",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "ecency.stats",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        },
        {
          "authorityAccount": "esteem.app",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "esteem.app",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        },
        {
          "authorityAccount": "esteemapp",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "good-karma",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        },
        {
          "authorityAccount": "good-karma",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "esteemapp",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        }
      ],
      "transactionOtherData": {
        "isValid": true,
        "signeesByKeys": [
          [
            "esteemapp"
          ],
          [
            "ecency.stats"
          ],
          [
            "esteem.app"
          ],
          [
            "good-karma"
          ],
          [
            "ecency"
          ]
        ]
      }
    });
  });

  test('Should analyze a correct multiple operation multiple signature transaction by its id', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ inspectorEngine }, multipleOperationMultipleSignatureTransactionId) => {
      const tx = await inspectorEngine.processTransactionId(multipleOperationMultipleSignatureTransactionId);

      return {
        signatureData: tx.signatureData,
        transactionData: tx.transactionData,
        requiredAuthoritiesData: tx.requiredAuthoritiesData,
        transactionBodyData: tx.transactionBodyData,
        transactionOtherData: { isValid: tx.transactionOtherData.isValid, signeesByKeys: tx.transactionOtherData.signeesByKeys }
      };
    }, multipleOperationMultipleSignatureTransactionId);

    expect(retVal).toEqual({
      "signatureData": [
        {
          "signature": "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
          "packType": "hf26",
          "publicKey": "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        },
        {
          "signature": "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
          "packType": "hf26",
          "publicKey": "STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        },
        {
          "signature": "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
          "packType": "hf26",
          "publicKey": "STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        },
        {
          "signature": "2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a",
          "packType": "hf26",
          "publicKey": "STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        },
        {
          "signature": "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5",
          "packType": "hf26",
          "publicKey": "STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        }
      ],
      "transactionData": {
        "id": "a7efc7be69861fdcdc39712e532beb8ddc701f03",
        "sigDigest": "acf004c792cd6196e0514f56d97bd8148b81872fbe12578386f4163971172f59",
        "tapos": {
          "refBlockNum": 808,
          "refBlockPrefix": 1359279161
        },
        "expirationTime": "2024-08-02T12:09:03"
      },
      "requiredAuthoritiesData": [
        {
          "matchingSignature": "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5",
          "authorityAccount": "ecency",
          "authorityType": "Posting",
          "isSatisfied": "true"
        },
        {
          "matchingSignature": "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
          "authorityAccount": "ecency.stats",
          "authorityType": "Posting",
          "isSatisfied": "true"
        },
        {
          "matchingSignature": "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
          "authorityAccount": "esteem.app",
          "authorityType": "Posting",
          "isSatisfied": "true"
        },
        {
          "matchingSignature": "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
          "authorityAccount": "esteemapp",
          "authorityType": "Posting",
          "isSatisfied": "true"
        },
        {
          "matchingSignature": "2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a",
          "authorityAccount": "good-karma",
          "authorityType": "Posting",
          "isSatisfied": "true"
        }
      ],
      "transactionBodyData": [
        {
          "authorityAccount": "ecency",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "ecency",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        },
        {
          "authorityAccount": "ecency.stats",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "ecency.stats",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        },
        {
          "authorityAccount": "esteem.app",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "esteem.app",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        },
        {
          "authorityAccount": "esteemapp",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "good-karma",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        },
        {
          "authorityAccount": "good-karma",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "esteemapp",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        }
      ],
      "transactionOtherData": {
        "isValid": true,
        "signeesByKeys": [
          [
            "esteemapp"
          ],
          [
            "ecency.stats"
          ],
          [
            "esteem.app"
          ],
          [
            "good-karma"
          ],
          [
            "ecency"
          ]
        ]
      }
    });
  });

  test('Should analyze a correct multiple operation multiple signature transaction by its binary', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ inspectorEngine }, multipleOperationMultipleSignatureTransactionBinary) => {
      const tx = await inspectorEngine.processTransactionBinary(multipleOperationMultipleSignatureTransactionBinary);

      return {
        signatureData: tx.signatureData,
        transactionData: tx.transactionData,
        requiredAuthoritiesData: tx.requiredAuthoritiesData,
        transactionBodyData: tx.transactionBodyData,
        transactionOtherData: { isValid: tx.transactionOtherData.isValid, signeesByKeys: tx.transactionOtherData.signeesByKeys }
      };
    }, multipleOperationMultipleSignatureTransactionBinary);

    expect(retVal).toEqual({
      "signatureData": [
        {
          "signature": "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
          "packType": "hf26",
          "publicKey": "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        },
        {
          "signature": "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
          "packType": "hf26",
          "publicKey": "STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        },
        {
          "signature": "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
          "packType": "hf26",
          "publicKey": "STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        },
        {
          "signature": "2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a",
          "packType": "hf26",
          "publicKey": "STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        },
        {
          "signature": "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5",
          "packType": "hf26",
          "publicKey": "STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43",
          "authorityPath": [
            {
              "account": [
                "ecency",
                "ecency.stats",
                "esteem.app",
                "esteemapp",
                "good-karma"
              ]
            }
          ]
        }
      ],
      "transactionData": {
        "id": "a7efc7be69861fdcdc39712e532beb8ddc701f03",
        "sigDigest": "acf004c792cd6196e0514f56d97bd8148b81872fbe12578386f4163971172f59",
        "tapos": {
          "refBlockNum": 808,
          "refBlockPrefix": 1359279161
        },
        "expirationTime": "2024-08-02T12:09:03"
      },
      "requiredAuthoritiesData": [
        {
          "matchingSignature": "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5",
          "authorityAccount": "ecency",
          "authorityType": "Posting",
          "isSatisfied": "true"
        },
        {
          "matchingSignature": "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
          "authorityAccount": "ecency.stats",
          "authorityType": "Posting",
          "isSatisfied": "true"
        },
        {
          "matchingSignature": "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
          "authorityAccount": "esteem.app",
          "authorityType": "Posting",
          "isSatisfied": "true"
        },
        {
          "matchingSignature": "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
          "authorityAccount": "esteemapp",
          "authorityType": "Posting",
          "isSatisfied": "true"
        },
        {
          "matchingSignature": "2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a",
          "authorityAccount": "good-karma",
          "authorityType": "Posting",
          "isSatisfied": "true"
        }
      ],
      "transactionBodyData": [
        {
          "authorityAccount": "ecency",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "ecency",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        },
        {
          "authorityAccount": "ecency.stats",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "ecency.stats",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        },
        {
          "authorityAccount": "esteem.app",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "esteem.app",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        },
        {
          "authorityAccount": "esteemapp",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "good-karma",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        },
        {
          "authorityAccount": "good-karma",
          "authorityType": "Posting",
          "isSatisfied": "true",
          "operationType": "vote_operation",
          "operationContent": {
            "voter": "esteemapp",
            "author": "el-panal",
            "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024",
            "weight": 100
          }
        }
      ],
      "transactionOtherData": {
        "isValid": true,
        "signeesByKeys": [
          [
            "esteemapp"
          ],
          [
            "ecency.stats"
          ],
          [
            "esteem.app"
          ],
          [
            "good-karma"
          ],
          [
            "ecency"
          ]
        ]
      }
    });
  });

  test('Should analyze a incorrect single operation single signature transaction by its json', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ inspectorEngine }, incorrectSingleOperationSingleSignatureTransaction) => {
      const tx = await inspectorEngine.processTransaction(incorrectSingleOperationSingleSignatureTransaction);

      return {
        signatureData: tx.signatureData,
        transactionData: tx.transactionData,
        requiredAuthoritiesData: tx.requiredAuthoritiesData,
        transactionBodyData: tx.transactionBodyData,
        transactionOtherData: { isValid: tx.transactionOtherData.isValid, signeesByKeys: tx.transactionOtherData.signeesByKeys }
      };
    }, incorrectSingleOperationSingleSignatureTransaction);

    expect(retVal).toEqual({
      "signatureData": [
        {
          "signature": "203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ff", // Incorrect signature
          "packType": "unknown",
          "publicKey": "STM62KzA9tPSLczvBfKg4F7BCjadXdXYoCTgALYTNgJfRDPPNgRmh", // Incorrect public key because of the incorrect signature
          "authorityPath": [
            {
              "account": [
                ""
              ]
            }
          ] // No authority path, cannot find any account attached to the public key
        }
      ],
      "transactionData": {
        "id": {
          "hf26": "1da45e713070f41ea92bfd7594d3e215036617ac",
          "legacy": "da9602787693edccdafa1e7325502e0bb14453d1"
        },
        "sigDigest": {
          "hf26": "4a87e37d0b4642815946102ad85f9da6c6a5795c554cb2d7a7f0f782d7d9fed1",
          "legacy": "3b61fc6ece0de73ed01897bb3fa00c74d32b968843e4b79fe66d0c5e2c8ec2da"
        },
        "tapos": {
          "refBlockNum": 33561,
          "refBlockPrefix": 2922397352
        },
        "expirationTime": "2024-09-20T12:16:45"
      },
      "requiredAuthoritiesData": [
        {
          "matchingSignature": "Missing signature",
          "authorityAccount": "splinterboost",
          "authorityType": "Active",
          "isSatisfied": "false"
        }
      ],
      "transactionBodyData": [
        {
          "authorityAccount": "splinterboost",
          "authorityType": "Active",
          "isSatisfied": "false",
          "operationType": "transfer_operation",
          "operationContent": {
            "from": "splinterboost",
            "to": "bluehy20",
            "amount": {
              "amount": "14",
              "precision": 3,
              "nai": "@@000000021"
            },
            "memo": "Thank you for delegating to Splinterboost here is your daily HIVE payout!"
          }
        }
      ],
      "transactionOtherData": {
        "isValid": false,
        "signeesByKeys": [
          [] // No signees because of the incorrect public key
        ]
      }
    });
  });

  test('Should be able to change the chain id', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ inspectorEngine }) => {
      await inspectorEngine.changeConfig('customChainId', 'https://api.hive.blog/');

      return inspectorEngine.config.chainId;
    });

    expect(retVal).toEqual('customChainId');
  });

  test('Should be able to change the api endpoint', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ inspectorEngine }) => {
      await inspectorEngine.changeConfig('beeab0de00000000000000000000000000000000000000000000000000000000', 'https://api.test.com');

      return inspectorEngine.config.apiEndpoint;
    });

    expect(retVal).toEqual('https://api.test.com');
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
