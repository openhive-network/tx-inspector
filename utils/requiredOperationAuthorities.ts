export const requiredPostingAuthority = [
  'comment_operation',
  'comment_options_operation',
  'delete_comment_operation',
  'vote_operation',
  'claim_reward_balance_operation',
  'claim_reward_balance2_operation'
];

export const requiredActiveAuthority = [
  'account_create_operation',
  'account_create_with_delegation_operation',
  'claim_account_operation',
  'create_claimed_account_operation',
  'transfer_operation',
  'escrow_transfer_operation',
  'escrow_approve_operation',
  'escrow_dispute_operation',
  'escrow_release_operation',
  'transfer_to_vesting_operation',
  'withdraw_vesting_operation',
  'set_withdraw_vesting_route_operation',
  'witness_update_operation',
  'account_witness_vote_operation',
  'account_witness_proxy_operation',
  'custom_operation',
  'feed_publish_operation',
  'convert_operation',
  'collateralized_convert_operation',
  'limit_order_create_operation',
  'limit_order_create2_operation',
  'limit_order_cancel_operation',
  'pow_operation',
  'pow2_operation',
  'request_account_recovery_operation',
  'reset_account_operation',
  'transfer_to_savings_operation',
  'transfer_from_savings_operation',
  'cancel_transfer_from_savings_operation',
  'delegate_vesting_shares_operation',
  'recurrent_transfer_operation'
];

export const requiredOwnerAuthority = [
  'change_recovery_account_operation',
  'decline_voting_rights_operation'
];

export const requiredPostingAndActiveAuthority = [
  'custom_json_operation'
];

export const requiredPostingOrActiveAuthority = [
  'set_reset_account_operation'
];

export const requiredActiveOrOwnerAuthority = [
  'account_update_operation'
];

export const requiredAnyAuthority = [
  'account_update2_operation'
];

export const requiredEveryAuthority = [
  'custom_binary_operation'
];
