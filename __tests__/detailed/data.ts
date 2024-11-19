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

export const singleOperationSingleSignatureTransactionBinary = '1983a83e30aead67ed6601020d73706c696e746572626f6f737408626c7565687932300e000000000000002320bcbe495468616e6b20796f7520666f722064656c65676174696e6720746f2053706c696e746572626f6f7374206865726520697320796f7572206461696c792048495645207061796f7574210001203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07'

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

export const multipleOperationMultipleSignatureTransactionBinary = '280339f404515fccac660500066563656e637908656c2d70616e616c37656c2d70616e616c2d70726573656e746163696f6e2d64652d6175746f7265732d64657374616361646f732d64696133313037323032346400000c6563656e63792e737461747308656c2d70616e616c37656c2d70616e616c2d70726573656e746163696f6e2d64652d6175746f7265732d64657374616361646f732d64696133313037323032346400000a65737465656d2e61707008656c2d70616e616c37656c2d70616e616c2d70726573656e746163696f6e2d64652d6175746f7265732d64657374616361646f732d64696133313037323032346400000a676f6f642d6b61726d6108656c2d70616e616c37656c2d70616e616c2d70726573656e746163696f6e2d64652d6175746f7265732d64657374616361646f732d64696133313037323032346400000965737465656d61707008656c2d70616e616c37656c2d70616e616c2d70726573656e746163696f6e2d64652d6175746f7265732d64657374616361646f732d6469613331303732303234640000051f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc572620223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac12043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5'

export const claimAccountOperationTransaction = {
  "ref_block_num": 18787,
  "ref_block_prefix": 1991145749,
  "extensions": [],
  "expiration": "2024-10-17T08:17:24",
  "operations": [
    {
      "type": "claim_account_operation",
      "value": {
        "fee": {
          "nai": "@@000000021",
          "amount": "0",
          "precision": 3
        },
        "creator": "gtg",
        "extensions": []
      }
    }
  ],
  "signatures": [
    "1f0e6420c3cf4f084da52d37ed010909fef7ab12596ee47276ce62b1b1ffb4b18c0958c466654aaf77681661516ddef688fd5289d131198d123e5259447aee2c5c"
  ]
};

export const singleVoteOperationSingleSignatureTransaction = {
  "ref_block_num": 18666,
  "ref_block_prefix": 2298275031,
  "extensions": [],
  "expiration": "2024-09-19T23:41:03",
  "operations": [
    {
      "type": "transfer_operation",
      "value": {
        "to": "abw.pay",
        "from": "andablackwidow",
        "memo": "",
        "amount": {
          "nai": "@@000000013",
          "amount": "20000",
          "precision": 3
        }
      }
    }
  ],
  "signatures": [
    "204e6e9b49d7aa38c5ed10e48c0f6371fba4b018c450590b6e4025e3e96ed3e30c57eb05d545ea5319825c859a9752487c25c7e5086f7971675e55037f922e5295"
  ]
};

export const multipleOperationSingleSignatureTransaction = {
  "ref_block_num": 18925,
  "ref_block_prefix": 2219782745,
  "extensions": [],
  "expiration": "2024-07-29T13:47:57",
  "operations": [
    {
      "type": "comment_operation",
      "value": {
        "body": "It should be easy to test - just cut out two lines with `session` in `database::apply_block_extended` (I'm actually assuming that out of order blocks won't reach that routine during sync, but if they do, it would be a source of slowdown).\n\nI'd be surprised if undo sessions were the problem. They are relatively slow and [worthy of optimization](https://gitlab.syncad.com/hive/hive/-/issues/675#note_159293), but in relation to simple transactions, mostly custom_jsons, so their performance is significant when there is many of them, like during block production, reapplication of pending or in extreme stress tests with `colony`+`queen`. During sync we only have one session per block.",
        "title": "",
        "author": "andablackwidow",
        "permlink": "she0jc",
        "json_metadata": "{\"links\":[\"https://gitlab.syncad.com/hive/hive/-/issues/675#note_159293\"],\"app\":\"hiveblog/0.1\"}",
        "parent_author": "blocktrades",
        "parent_permlink": "shayan"
      }
    },
    {
      "type": "comment_options_operation",
      "value": {
        "author": "andablackwidow",
        "permlink": "she0jc",
        "extensions": [],
        "allow_votes": true,
        "percent_hbd": 10000,
        "max_accepted_payout": {
          "nai": "@@000000013",
          "amount": "1000000000",
          "precision": 3
        },
        "allow_curation_rewards": true
      }
    }
  ],
  "signatures": [
    "1f4d77e5138520c691f1fdcb794a2056a2f6a28fed02d85e4fcda2768ea852144a7eb141d23e00ec9033ba80f7bae711f61d7a6a85fad80916a8bfe6586f645200"
  ]
};

export const singleOperationSingleSignatureDelegatedAuthorityTransaction = {
  "ref_block_num": 31682,
  "ref_block_prefix": 1691585842,
  "extensions": [],
  "expiration": "2024-10-01T20:10:59",
  "operations": [
    {
      "type": "vote_operation",
      "value": {
        "voter": "tattooworld",
        "author": "mamaemigrante",
        "weight": 10000,
        "permlink": "buscando-ollas-nuevas-para-mi-cocina-looking-for-new-pots-and-pans-for-my-kitchen"
      }
    }
  ],
  "signatures": [
    "20543c6e9e5ea2acfb94e9c5cd6672f302d067b62a4c71832dcaec7caf5e83a83b45ae76c55e3f51f8eb254b460a0585e7f911a93d6e5a58522429b7a4678dc22e"
  ]
};
