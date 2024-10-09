export const singleOperationSingleSignatureTransaction = {
  "ref_block_num": 33561,
  "ref_block_prefix": 2922397352,
  "extensions": [],
  "expiration": "2024-09-20T12:16:45",
  "operations": [
    {
      "type": "transfer_operation",
      "value": {
        "to": "bluehy20",
        "from": "splinterboost",
        "memo": "Thank you for delegating to Splinterboost here is your daily HIVE payout!",
        "amount": {
          "nai": "@@000000021",
          "amount": "14",
          "precision": 3
        }
      }
    }
  ],
  "signatures": [
    "203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07"
  ]
};

export const incorrectSingleOperationSingleSignatureTransaction = {
  "ref_block_num": 33561,
  "ref_block_prefix": 2922397352,
  "extensions": [],
  "expiration": "2024-09-20T12:16:45",
  "operations": [
    {
      "type": "transfer_operation",
      "value": {
        "to": "bluehy20",
        "from": "splinterboost",
        "memo": "Thank you for delegating to Splinterboost here is your daily HIVE payout!",
        "amount": {
          "nai": "@@000000021",
          "amount": "14",
          "precision": 3
        }
      }
    }
  ],
  "signatures": [
    "203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ff"
  ]
};

export const singleOperationSingleSignatureTransactionId = 'da9602787693edccdafa1e7325502e0bb14453d1';

export const multipleOperationMultipleSignatureTransaction = {
  "ref_block_num": 808,
  "ref_block_prefix": 1359279161,
  "extensions": [],
  "expiration": "2024-08-02T12:09:03",
  "operations": [
    {
      "type": "vote_operation",
      "value": {
        "voter": "ecency",
        "author": "el-panal",
        "weight": 100,
        "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
      }
    },
    {
      "type": "vote_operation",
      "value": {
        "voter": "ecency.stats",
        "author": "el-panal",
        "weight": 100,
        "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
      }
    },
    {
      "type": "vote_operation",
      "value": {
        "voter": "esteem.app",
        "author": "el-panal",
        "weight": 100,
        "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
      }
    },
    {
      "type": "vote_operation",
      "value": {
        "voter": "good-karma",
        "author": "el-panal",
        "weight": 100,
        "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
      }
    },
    {
      "type": "vote_operation",
      "value": {
        "voter": "esteemapp",
        "author": "el-panal",
        "weight": 100,
        "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
      }
    }
  ],
  "signatures": [
    "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
    "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
    "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
    "2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a",
    "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5"
  ]
};

export const multipleOperationMultipleSignatureTransactionId = 'a7efc7be69861fdcdc39712e532beb8ddc701f03';