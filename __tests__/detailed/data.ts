import type { ApiDelayedVote } from '@hiveio/wax';
import { type IMockData } from '../assets/api-mock';

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
}

export const test1_mocked_data: IMockData = {
  validTxAuthority: true,
  keyReferences: [
    "gtg",
    "initminer"
  ],
  accounts: [
    {
      active: {
        account_auths: [],
        key_auths: [[ "STM8NWQYG4BvjGNu8zqqV9fbR7aSCZHcxkVib41PYnpGmPRe6BHVG", 1 ]],
        weight_threshold: 1
      },
      balance: { amount: "10", nai: "@@000000021", precision: 3 },
      can_vote: true,
      comment_count: 0,
      created: "2016-06-30T17:22:18",
      curation_rewards: 344239652,
      delayed_votes: [] as unknown as ApiDelayedVote,
      delegated_vesting_shares: { amount: "0", nai: "@@000000037", precision: 6 },
      downvote_manabar: { current_mana: 645066889428726, last_update_time: 1729154715 },
      governance_vote_expiration_ts: "2025-05-21T15:04:57",
      hbd_balance: { amount: "261", nai: "@@000000013", precision: 3 },
      hbd_last_interest_payment: "2021-06-13T21:34:42",
      hbd_seconds: "26576708016",
      hbd_seconds_last_update: "2021-06-30T11:10:30",
      id: 14007,
      is_smt: false,
      json_metadata: '{"profile":{"witness_description": "Gandalf the Grey, building Hive, improving Hive infrastructure.","profile_image":"https://grey.house/img/grey_4.jpg","name":"Gandalf the Grey","about":"IT Wizard, Hive Witness","location":"Hive","version":2}}',
      last_account_recovery: "2016-07-21T21:48:03",
      last_account_update: "2021-03-30T10:07:15",
      last_owner_update: "2017-03-21T18:37:42",
      last_post: "2024-10-16T21:10:51",
      last_post_edit: "2024-10-16T21:10:51",
      last_root_post: "2024-09-24T21:33:18",
      last_vote_time: "2024-10-16T21:29:33",
      lifetime_vote_count: 0,
      memo_key: "STM4uD3dfLvbz7Tkd7of4K9VYGnkgrY5BHSQt52vE52CBL5qBfKHN",
      mined: true,
      name: "gtg",
      next_vesting_withdrawal: "1969-12-31T23:59:59",
      open_recurrent_transfers: 0,
      owner: {
        account_auths: [],
        key_auths: [["STM5RLQ1Jh8Kf56go3xpzoodg4vRsgCeWhANXoEXrYH7bLEwSVyjh", 1]],
        weight_threshold: 1,
      },
      pending_claimed_accounts: 54795,
      pending_transfers: 0,
      post_bandwidth: 10000,
      post_count: 6920,
      post_voting_power: { amount: "2580267557714906", nai: "@@000000037", precision: 6 },
      posting: {
        account_auths: [],
        key_auths: [[ "STM5tp5hWbGLL1R3tMVsgYdYxLPyAQFdKoYFbT2hcWUmrU42p1MQC", 1 ]],
        weight_threshold: 1
      },
      posting_json_metadata: '{"profile":{"witness_description":"Gandalf the Grey, Building Hive.","about":"IT Wizard, Hive Witness","profile_image":"https://grey.house/img/grey_4.jpg","name":"Gandalf the Grey","location":"Hive","version":2}}',
      posting_rewards: 21510281,
      previous_owner_update: "2016-07-21T21:48:03",
      proxied_vsf_votes: [1735931208798870, 65241362984230, 32796859176, 0],
      proxy: "",
      received_vesting_shares: { amount: "106902000000", nai: "@@000000037", precision: 6 },
      recovery_account: "roelandp",
      reset_account: "null",
      reward_hbd_balance: { amount: "0", nai: "@@000000013", precision: 3 },
      reward_hive_balance: { amount: "0", nai: "@@000000021", precision: 3 },
      reward_vesting_balance: { amount: "0", nai: "@@000000037", precision: 6 },
      reward_vesting_hive: { amount: "0", nai: "@@000000021", precision: 3 },
      savings_balance: { amount: "1", nai: "@@000000021", precision: 3 },
      savings_hbd_balance: { amount: "1", nai: "@@000000013", precision: 3 },
      savings_hbd_last_interest_payment: "2023-10-09T13:36:39",
      savings_hbd_seconds: "0",
      savings_hbd_seconds_last_update: "2023-10-09T13:36:39",
      savings_withdraw_requests: 0,
      to_withdraw: 0,
      vesting_shares: { amount: "2580160655714906", nai: "@@000000037", precision: 6 },
      vesting_withdraw_rate: { amount: "0", nai: "@@000000037", precision: 6 },
      voting_manabar: { current_mana: 2230273973658874, last_update_time: 1729154715 },
      withdraw_routes: 0,
      withdrawn: 0,
      witnesses_voted_for: 28
    }
  ]
};
