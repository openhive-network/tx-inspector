import { type ChromiumBrowser, type ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { jsonTransferOperationTransaction, jsonTransferOperationTransactionId, multiSignaturesTransaction } from './data';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let browser!: ChromiumBrowser;

test.describe('transaction inspector tests based on wax library', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test.beforeEach(async ({ page }) => {
    page.on('console', (msg: ConsoleMessage) => {
      // eslint-disable-next-line no-console
      console.log('>>', msg.type(), msg.text());
    });

    await page.goto('http://localhost:8080/__tests__/assets/test.html', { waitUntil: 'load' });
  });

  test('Should be able to get transaction in proto form', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }, jsonTransferOperationTransaction) => {
      return await wax.getProtoTransaction(jsonTransferOperationTransaction);
    }, jsonTransferOperationTransaction);

    expect(retVal).toStrictEqual({
      "expiration": "2024-09-20T12:16:45",
      "extensions": [],
      "operations": [
        {
          "account_create": undefined,
          "account_create_with_delegation": undefined,
          "account_created": undefined,
          "account_update": undefined,
          "account_update2": undefined,
          "account_witness_proxy": undefined,
          "account_witness_vote": undefined,
          "author_reward": undefined,
          "cancel_transfer_from_savings": undefined,
          "change_recovery_account": undefined,
          "changed_recovery_account": undefined,
          "claim_account": undefined,
          "claim_reward_balance": undefined,
          "clear_null_account_balance": undefined,
          "collateralized_convert": undefined,
          "collateralized_convert_immediate_conversion": undefined,
          "comment": undefined,
          "comment_benefactor_reward": undefined,
          "comment_options": undefined,
          "comment_payout_update": undefined,
          "comment_reward": undefined,
          "consolidate_treasury_balance": undefined,
          "convert": undefined,
          "create_claimed_account": undefined,
          "create_proposal": undefined,
          "curation_reward": undefined,
          "custom": undefined,
          "custom_json": undefined,
          "decline_voting_rights": undefined,
          "declined_voting_rights": undefined,
          "delayed_voting": undefined,
          "delegate_vesting_shares": undefined,
          "delete_comment": undefined,
          "dhf_conversion": undefined,
          "dhf_funding": undefined,
          "effective_comment_vote": undefined,
          "escrow_approve": undefined,
          "escrow_approved": undefined,
          "escrow_dispute": undefined,
          "escrow_rejected": undefined,
          "escrow_release": undefined,
          "escrow_transfer": undefined,
          "expired_account_notification": undefined,
          "failed_recurrent_transfer": undefined,
          "feed_publish": undefined,
          "fill_collateralized_convert_request": undefined,
          "fill_convert_request": undefined,
          "fill_order": undefined,
          "fill_recurrent_transfer": undefined,
          "fill_transfer_from_savings": undefined,
          "fill_vesting_withdraw": undefined,
          "hardfork": undefined,
          "hardfork_hive": undefined,
          "hardfork_hive_restore": undefined,
          "ineffective_delete_comment": undefined,
          "interest": undefined,
          "limit_order_cancel": undefined,
          "limit_order_cancelled": undefined,
          "limit_order_create": undefined,
          "limit_order_create2": undefined,
          "liquidity_reward": undefined,
          "pow": undefined,
          "pow2": undefined,
          "pow_reward": undefined,
          "producer_missed": undefined,
          "producer_reward": undefined,
          "proposal_fee": undefined,
          "proposal_pay": undefined,
          "proxy_cleared": undefined,
          "recover_account": undefined,
          "recurrent_transfer": undefined,
          "remove_proposal": undefined,
          "request_account_recovery": undefined,
          "return_vesting_delegation": undefined,
          "set_withdraw_vesting_route": undefined,
          "shutdown_witness": undefined,
          "system_warning": undefined,
          "transfer": {
            "amount": { "amount": "14", "nai": "@@000000021", "precision": 3 },
            "from_account": "splinterboost",
            "memo": "Thank you for delegating to Splinterboost here is your daily HIVE payout!",
            "to_account": "bluehy20"
          },
          "transfer_from_savings": undefined,
          "transfer_to_savings": undefined,
          "transfer_to_vesting": undefined,
          "transfer_to_vesting_completed": undefined,
          "update_proposal": undefined,
          "update_proposal_votes": undefined,
          "vesting_shares_split": undefined,
          "vote": undefined,
          "withdraw_vesting": undefined,
          "witness_block_approve": undefined,
          "witness_set_properties": undefined,
          "witness_update": undefined
        }],
        "ref_block_num": 33561,
        "ref_block_prefix": 2922397352,
        "signatures": [
          "203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07"
        ]
      });
  });

  test('Should be able to get transaction from id', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }, jsonTransferOperationTransactionId) => {
      return await wax.getTransactionFromId(jsonTransferOperationTransactionId);
    }, jsonTransferOperationTransactionId);

    expect(retVal).toStrictEqual({
      "block_num": 89096988,
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
      ],
      "transaction_id": "da9602787693edccdafa1e7325502e0bb14453d1",
      "transaction_num": 0,
    });
  });

  test('Should be able to get pack type with id', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }, jsonTransferOperationTransaction, jsonTransferOperationTransactionId) => {
      return await wax.getPackType(jsonTransferOperationTransaction, jsonTransferOperationTransactionId);
    }, jsonTransferOperationTransaction, jsonTransferOperationTransactionId);

    expect(retVal).toBe('legacy');
  });

  test('Should be able to get pack type without id', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }, jsonTransferOperationTransaction) => {
      return await wax.getPackType(jsonTransferOperationTransaction);
    }, jsonTransferOperationTransaction);

    expect(retVal).toBe('legacy');
  });

  test('Should be able to get signatures from transaction with one signature', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }, jsonTransferOperationTransaction) => {
      return await wax.getSignatures(jsonTransferOperationTransaction);
    }, jsonTransferOperationTransaction);

    expect(retVal).toStrictEqual([
      '203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07'
    ]);
  });

  test('Should be able to get signatures from transaction with multi signatures', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }, multiSignaturesTransaction) => {
      return await wax.getSignatures(multiSignaturesTransaction);
    }, multiSignaturesTransaction);

    expect(retVal).toStrictEqual([
      '1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726',
      '20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f',
      '20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1',
      '2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a',
      '205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5'
    ]);
  });

  test('Should be able to get signature keys from transaction with one signature', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }, jsonTransferOperationTransaction) => {
      return await wax.getSignatureKeys(jsonTransferOperationTransaction);
    }, jsonTransferOperationTransaction);

    expect(retVal).toStrictEqual(['STM7jDAdjyLYgqhyCwSafVzNGN4PLBGWrYB9uJun4AitZA8TERgif']);
  });

  test('Should be able to get signature keys from transaction with multi signatures', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }, multiSignaturesTransaction) => {
      return await wax.getSignatureKeys(multiSignaturesTransaction);
    }, multiSignaturesTransaction);

    expect(retVal).toStrictEqual([
      'STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP',
      'STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd',
      'STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK',
      'STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR',
      'STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43',
    ]);
  });

  test('Should be able to get transaction id', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }, jsonTransferOperationTransaction) => {
      return await wax.getTransactionId(jsonTransferOperationTransaction);
    }, jsonTransferOperationTransaction);

    expect(retVal).toStrictEqual('da9602787693edccdafa1e7325502e0bb14453d1');
  });

  test('Should be able to get sig digest', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }, jsonTransferOperationTransaction) => {
      return await wax.getSigDigest(jsonTransferOperationTransaction);
    }, jsonTransferOperationTransaction);

    expect(retVal).toStrictEqual('3b61fc6ece0de73ed01897bb3fa00c74d32b968843e4b79fe66d0c5e2c8ec2da');
  });

  test('Should be able to get posting account auths', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }) => {
      const accounts = await wax.getAccounts(['splinterboost']);

      return accounts[0].posting.account_auths;
    });

    expect(retVal).toStrictEqual([["steemauto", 1]]);
  });

  test('Should be able to get active account auths', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }) => {
      const accounts = await wax.getAccounts(['splinterboost']);

      return accounts[0].active.account_auths;
    });

    expect(retVal).toHaveLength(0);
  });

  test('Should be able to get owner account auths', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }) => {
      const accounts = await wax.getAccounts(['splinterboost']);

      return accounts[0].owner.account_auths;
    });

    expect(retVal).toHaveLength(0);
  });

  test('Should be able to get posting key auths', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }) => {
      const accounts = await wax.getAccounts(['splinterboost']);

      return accounts[0].posting.key_auths;
    });

    expect(retVal).toStrictEqual([["STM8P3VooSAo7MJtY7Up7fTCmbWMHMAzGub8775LdvyNyd8w32itj", 1]]);
  });

  test('Should be able to get active key auths', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }) => {
      const accounts = await wax.getAccounts(['splinterboost']);

      return accounts[0].active.key_auths;
    });

    expect(retVal).toStrictEqual([["STM7jDAdjyLYgqhyCwSafVzNGN4PLBGWrYB9uJun4AitZA8TERgif", 1]]);
  });

  test('Should be able to get owner key auths', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }) => {
      const accounts = await wax.getAccounts(['splinterboost']);

      return accounts[0].owner.key_auths;
    });

    expect(retVal).toStrictEqual([["STM7f9xtSen2JNf3mi7ga1DpESVmd1as2pTHAUjnxmYKZK15jSShz", 1]]);
  });

  test('Should be able to get authority type level', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }, jsonTransferOperationTransaction) => {
      const auth = await wax.getAuthorityType(jsonTransferOperationTransaction);

      return auth[0].level;
    }, jsonTransferOperationTransaction);

    expect(retVal).toStrictEqual('Active');
  });

  test('Should be able to get authority type accounts', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }, jsonTransferOperationTransaction) => {
      return await wax.getOperationsFromTransaction(jsonTransferOperationTransaction);
    }, jsonTransferOperationTransaction);

    expect(retVal).toStrictEqual([
      {
        "type": "transfer_operation",
        "value": {
          "amount": { "amount": "14", "nai": "@@000000021", "precision": 3 },
          "from": "splinterboost",
          "memo": "Thank you for delegating to Splinterboost here is your daily HIVE payout!",
          "to": "bluehy20"
        }
      }
    ]);
  });

  test('Should be able to get signees for keys', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }) => {
      return await wax.findSigneesForKeys(['STM7jDAdjyLYgqhyCwSafVzNGN4PLBGWrYB9uJun4AitZA8TERgif']);
    });

    expect(retVal).toStrictEqual([['splinterboost']]);
  });

  test('Should be able to get signees for keys with multi keys', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }) => {
      return await wax.findSigneesForKeys([
        'STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP',
        'STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd',
        'STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK',
        'STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR',
        'STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43',
      ]);
    });

    expect(retVal).toStrictEqual([
      ['esteemapp'],
      ['ecency.stats'],
      ['esteem.app'],
      ['good-karma'],
      ['ecency']
    ]);
  });

  test('Should be able to verify authority', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest (async ({ wax }, jsonTransferOperationTransaction) => {
      return await wax.checkVerifyAuthority(jsonTransferOperationTransaction);
    }, jsonTransferOperationTransaction);

    expect(retVal).toBeTruthy();
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
