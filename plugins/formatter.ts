/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import {
  CommunityOperationData,
  FollowOperationData,
  ReblogOperationData,
  ResourceCreditsOperationData,
  WaxFormattable
} from '@hiveio/wax/vite';
import type {
  DeepReadonly,
  IFormatFunctionArguments,
  IWaxBaseInterface,
  IWaxCustomFormatter,
  IWaxExtendableFormatter,
  NaiAsset,
  TAccountName,
  account_create,
  account_create_with_delegation,
  account_created,
  account_update,
  account_update2,
  account_witness_proxy,
  account_witness_vote,
  author_reward,
  cancel_transfer_from_savings,
  change_recovery_account,
  changed_recovery_account,
  claim_account,
  claim_reward_balance,
  clear_null_account_balance,
  collateralized_convert,
  collateralized_convert_immediate_conversion,
  comment,
  comment_benefactor_reward,
  comment_options,
  comment_payout_update,
  comment_reward,
  consolidate_treasury_balance,
  convert,
  create_claimed_account,
  create_proposal,
  curation_reward,
  custom,
  custom_json,
  decline_voting_rights,
  declined_voting_rights,
  delayed_voting,
  delegate_vesting_shares,
  delete_comment,
  dhf_conversion,
  dhf_funding,
  effective_comment_vote,
  escrow_approve,
  escrow_approved,
  escrow_dispute,
  escrow_rejected,
  escrow_release,
  escrow_transfer,
  expired_account_notification,
  failed_recurrent_transfer,
  feed_publish,
  fill_collateralized_convert_request,
  fill_convert_request,
  fill_order,
  fill_recurrent_transfer,
  fill_transfer_from_savings,
  fill_vesting_withdraw,
  hardfork,
  hardfork_hive,
  hardfork_hive_restore,
  ineffective_delete_comment,
  interest,
  limit_order_cancel,
  limit_order_cancelled,
  limit_order_create,
  limit_order_create2,
  liquidity_reward,
  pow,
  pow2,
  pow_reward,
  producer_missed,
  producer_reward,
  proposal_fee,
  proposal_pay,
  proxy_cleared,
  recover_account,
  recurrent_transfer,
  remove_proposal,
  request_account_recovery,
  return_vesting_delegation,
  set_withdraw_vesting_route,
  shutdown_witness,
  system_warning,
  transfer,
  transfer_from_savings,
  transfer_to_savings,
  transfer_to_vesting,
  transfer_to_vesting_completed,
  update_proposal,
  update_proposal_votes,
  vesting_shares_split,
  vote,
  withdraw_vesting,
  witness_set_properties,
  witness_update
} from '@hiveio/wax/vite';
import { NuxtLink } from '#components';
import CopyWrapper from '~/components/ui/CopyWrapper.vue';
import { formatPercent } from '~/utils/formatters';

class OperationsFormatter implements IWaxCustomFormatter {
  constructor (
    private readonly chain: IWaxBaseInterface
  ) {
    const config = useRuntimeConfig();

    this.blockExplorerUrl = config.public.blockExplorerUrl;
  }

  private blockExplorerUrl: string;

  private getFormattedAmount (supply: NaiAsset | undefined): string {
    return (this.chain.formatter.format(supply));
  }

  private getFormattedDate (time: Date | string): string {
    return formatAndDelocalizeTime(time);
  }

  private getFormattedMultipleAssets (assets: DeepReadonly<NaiAsset[]>): string {
    let assetsMessage = '';

    assets.forEach((asset, index) => {
      assetsMessage += `${index !== 0 ? ', ' : ''}${this.getFormattedAmount(asset)}`;
    });

    return assetsMessage;
  }

  private getAccountLink (account: string): VNode {
    return h(
      CopyWrapper,
      { toCopy: account },
      {
        default: () =>
          h(
            NuxtLink,
            {
              to: `${this.blockExplorerUrl}/@${account}`,
              class: 'text-blue hover:opacity-70 transition-opacity',
              target: '_blank'
            },
            {
              default: () => `@${account} `
            }
          )
      }
    );
  }

  private getMultipleAccountsListLink (accounts: DeepReadonly<string[]>): VNode {
    return h(
      'span',
      accounts.map((account, index) => {
        return h('span', { key: index }, [this.getAccountLink(account), ' ']);
      })
    );
  }

  private getPermlink (author: string, permlink: string): VNode {
    return h(
      CopyWrapper,
      { toCopy: permlink },
      {
        default: () =>
          h(
            NuxtLink,
            { rel: 'noopener noreferrer', target: '_blank', href: `https://hive.blog/@${author}/${permlink}`, class: 'text-green hover:opacity-70 transition-opacity' },
            () => permlink
          )
      }
    );
  }

  private generateVueLink (elements: Array<string | VNode>): VNode {
    return h(
      'div',
      elements
    );
  }

  private getTransferMessage (transfer: transfer): VNode {
    return this.generateVueLink([
      this.getAccountLink(transfer.from_account),
      'transfered ',
      this.getFormattedAmount(transfer.amount),
      ' to ',
      this.getAccountLink(transfer.to_account)
    ]);
  }

  private getEscrowMessage (initialMessage: string, escrow: { from_account: TAccountName; to_account: TAccountName; agent: TAccountName }, amounts?: { hbd_amount?: NaiAsset, hive_amount?: NaiAsset }): VNode {
    const amountMessage = amounts ? `sent: ${this.getFormattedAmount(amounts.hbd_amount)} and ${this.getFormattedAmount(amounts.hive_amount)}` : '';

    return this.generateVueLink([
      initialMessage,
      this.getAccountLink(escrow.from_account),
      'to ',
      this.getAccountLink(escrow.to_account),
      'by agent ',
      this.getAccountLink(escrow.agent),
      amountMessage
    ]);
  }

  // formatters

  @WaxFormattable({ matchProperty: 'vote', requireDefined: true })
  public formatVote ({ source: { vote: op }, target }: IFormatFunctionArguments<{ vote: vote }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.voter),
      'voted on ',
      this.getAccountLink(op.author),
      '/ ',
      this.getPermlink(op.author, op.permlink),
        ` with ${formatPercent(op.weight)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'comment', requireDefined: true })
  public formatComment ({ source: { comment: op }, target }: IFormatFunctionArguments<{ comment: comment }>) {
    let message: VNode;

    if (op.parent_author === '')
      message = this.generateVueLink([
        this.getAccountLink(op.author),
        'created new comment: ',
        this.getPermlink(op.author, op.permlink)
      ]);
    else
      message = this.generateVueLink([
        this.getAccountLink(op.author),
        'wrote a comment ',
        this.getPermlink(op.author, op.permlink),
        ' for a post: ',
        this.getPermlink(op.parent_author, op.parent_permlink)
      ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'transfer', requireDefined: true })
  public formatTransfer ({ source: { transfer: op }, target }: IFormatFunctionArguments<{ transfer: transfer }>) {
    const message = this.getTransferMessage(op);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'transfer_to_vesting', requireDefined: true })
  public formatTransferToVestingOperation ({ source: { transfer_to_vesting: op }, target }: IFormatFunctionArguments<{ transfer_to_vesting: transfer_to_vesting }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.from_account),
      'transfered ',
      this.getFormattedAmount(op.amount),
      ' to vesting'
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'withdraw_vesting', requireDefined: true })
  public formatWithdrawVestingOperation ({ source: { withdraw_vesting: op }, target }: IFormatFunctionArguments<{ withdraw_vesting: withdraw_vesting }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.account),
      'withdrawed ',
      this.getFormattedAmount(op.vesting_shares)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'limit_order_create', requireDefined: true })
  public formatLimitOrderCreateOperation ({ source: { limit_order_create: op }, target }: IFormatFunctionArguments<{ limit_order_create: limit_order_create }>) {
    const expiration = op.fill_or_kill ? '' : `, expiration: ${this.getFormattedDate(op.expiration)}`;
    const message = this.generateVueLink([
      this.getAccountLink(op.owner),
      'wants to sell ',
      this.getFormattedAmount(op.amount_to_sell),
      ' for at least',
      this.getFormattedAmount(op.min_to_receive),
        `, ID: ${op.orderid}`,
        expiration
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'limit_order_cancel', requireDefined: true })
  public formatLimitOrderCancelOperation ({ source: { limit_order_cancel: op }, target }: IFormatFunctionArguments<{ limit_order_cancel: limit_order_cancel }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.owner),
        `cancelled limit order: ${op.orderid}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'feed_publish', requireDefined: true })
  public formatFeedPublishOperation ({ source: { feed_publish: op }, target }: IFormatFunctionArguments<{ feed_publish: feed_publish }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.publisher),
      'published the exchange rate: ',
      this.getFormattedAmount(op.exchange_rate?.base),
      ' for ',
      this.getFormattedAmount(op.exchange_rate?.quote)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'convert', requireDefined: true })
  public formatConvertOperation ({ source: { convert: op }, target }: IFormatFunctionArguments<{ convert: convert }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.owner),
        `starts convert operation: ${op.requestid} with amount: `,
        this.getFormattedAmount(op.amount)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'account_create', requireDefined: true })
  public formatAccountCreateOperation ({ source: { account_create: op }, target }: IFormatFunctionArguments<{ account_create: account_create }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.creator),
      'created new account: ',
      this.getAccountLink(op.new_account_name)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'account_update', requireDefined: true })
  public formatAccountUpdateOperation ({ source: { account_update: op }, target }: IFormatFunctionArguments<{ account_update: account_update }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.account),
        `updated account with memo key: ${op.memo_key}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'witness_update', requireDefined: true })
  public formatWitnessUpdateOperation ({ source: { witness_update: op }, target }: IFormatFunctionArguments<{ witness_update: witness_update }>) {
    let message: string | VNode = '';
    if (op.block_signing_key)
      message = this.generateVueLink([
        this.getAccountLink(op.owner),
          `updated witness data - HBD interest rate: ${formatPercent(op.props?.hbd_interest_rate || 0)},
   max block size: ${op.props?.maximum_block_size},
   account fee: ${this.getFormattedAmount(op.props?.account_creation_fee)}`
      ]);
    else
      message = this.generateVueLink([
        this.getAccountLink(op.owner),
        'resigned from being witness'
      ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'account_witness_vote', requireDefined: true })
  public formatAccountWitnessVoteOperation ({ source: { account_witness_vote: op }, target }: IFormatFunctionArguments<{ account_witness_vote: account_witness_vote }>) {
    let message: string | VNode = '';
    if (op.approve)
      message = this.generateVueLink([
        this.getAccountLink(op.account),
        'voted for witness ',
        this.getAccountLink(op.witness)
      ]);
    else
      message = this.generateVueLink([
        this.getAccountLink(op.account),
        'removed vote from witness ',
        this.getAccountLink(op.witness)
      ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'account_witness_proxy', requireDefined: true })
  public formatAccountWitnessProxyOperation ({ source: { account_witness_proxy: op }, target }: IFormatFunctionArguments<{ account_witness_proxy: account_witness_proxy }>) {
    let message: string | VNode = '';
    if (op.proxy !== '')
      message = this.generateVueLink([
        this.getAccountLink(op.account),
        'set a proxy for user ',
        this.getAccountLink(op.proxy)
      ]);
    else
      message = this.generateVueLink([
        this.getAccountLink(op.account),
        'removed a proxy'
      ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'pow', requireDefined: true })
  public formatPowOperation ({ source: { pow: op }, target }: IFormatFunctionArguments<{ pow: pow }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.worker_account),
      'made a prove of work'
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'custom', requireDefined: true })
  public formatcustomOperation ({ source: { custom: op }, target }: IFormatFunctionArguments<{ custom: custom }>) {
    const message = this.generateVueLink([
      this.getMultipleAccountsListLink(op.required_auths),
      'made custom operation'
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'delete_comment', requireDefined: true })
  public formatDeleteCommentOperation ({ source: { delete_comment: op }, target }: IFormatFunctionArguments<{ delete_comment: delete_comment }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.author),
      'deleted comment: ',
      this.getPermlink(op.author, op.permlink)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'custom_json', requireDefined: true })
  public formatCustomJsonOperation ({ source: { custom_json: op }, target }: IFormatFunctionArguments<{ custom_json: custom_json }>) {
    const message = this.generateVueLink([
      this.getMultipleAccountsListLink(op.required_auths),
      this.getMultipleAccountsListLink(op.required_posting_auths),
        `made custom JSON (${op.id})`
    ]);
    return { ...target, value: { message, json: op.json } };
  }

  @WaxFormattable({ matchInstanceOf: ResourceCreditsOperationData, requireDefined: true })
  public formatResourceCreditsOperation ({ target, source }: IFormatFunctionArguments<{ value: custom_json }, {value: ResourceCreditsOperationData}>) {
    const { value: op } = target;
    if (op.rc.amount === '0')
      return {
        ...target,
        value: {
          message: this.generateVueLink([
            this.getAccountLink(op.from),
            'removed delegation for ',
            this.getMultipleAccountsListLink(op.delegatees),
              `(${source.value.id})`
          ]),
          json: JSON.stringify(target.value)
        }
      };
    return {
      ...target,
      value: {
        message: this.generateVueLink([
          this.getAccountLink(op.from),
            `delegated ${this.getFormattedAmount(op.rc)} of RC for `,
            this.getMultipleAccountsListLink(op.delegatees),
            `(${source.value.id})`
        ]),
        json: JSON.stringify(target.value)
      }
    };
  }

  @WaxFormattable({ matchInstanceOf: FollowOperationData, requireDefined: true })
  public formatFollowOperation ({ target, source }: IFormatFunctionArguments<{ value: custom_json }, {value: FollowOperationData}>) {
    const { value: op } = target;
    const actionsMap = new Map<string, string>();
    actionsMap.set('blog', 'followed');
    actionsMap.set('', 'unfollowed');
    actionsMap.set('ignore', 'muted');
    actionsMap.set('reset_blacklist', 'reset blacklist of');
    actionsMap.set('reset_follow_blacklist', 'stopped following blacklist of');
    actionsMap.set('blacklist', 'blacklisted');
    actionsMap.set('follow_blacklist', 'followed blacklist of');
    actionsMap.set('unblacklist', 'unblacklisted');
    actionsMap.set('unfollow_blacklist', 'unfollowed blacklist of');
    actionsMap.set('reset_follow_muted_list', 'stopped following muted list of');
    actionsMap.set('follow_muted', 'followed muted list of');
    actionsMap.set('unfollow_muted', 'unfollowed muted list of');
    actionsMap.set('reset_all_lists', 'reset all lists of');
    actionsMap.set('reset_following_list', 'reset following list of');
    actionsMap.set('reset_muted_list', 'reset muted list of');
    return {
      ...target,
      value: {
        message: this.generateVueLink([
          this.getAccountLink(op.follower),
            `${actionsMap.get(op?.action) || ''} `,
            this.getMultipleAccountsListLink(op.following),
            `(${source.value.id})`
        ]),
        json: JSON.stringify(target.value)
      }
    };
  }

  @WaxFormattable({ matchInstanceOf: ReblogOperationData, requireDefined: true })
  public formatReblogOperation ({ target, source }: IFormatFunctionArguments<{ value: custom_json }, {value: ReblogOperationData}>) {
    const { value: op } = target;
    return {
      ...target,
      value: {
        message: this.generateVueLink([
          this.getAccountLink(op.account),
          'reblogged ',
          this.getPermlink(op.author, op.permlink),
            `(${source.value.id})`
        ]),
        json: JSON.stringify(target.value)
      }
    };
  }

  @WaxFormattable({ matchInstanceOf: CommunityOperationData, requireDefined: true })
  public formatCommunityOperation ({ target, source }: IFormatFunctionArguments<{ value: custom_json }, {value: CommunityOperationData}>) {
    const { value: op } = target;
    return {
      ...target,
      value: {
        message: this.generateVueLink([
          this.getMultipleAccountsListLink(op.accounts),
            `${op.data.action} to ${op.community} `,
            `(${source.value.id})`
        ]),
        json: JSON.stringify(target.value)
      }
    };
  }

  @WaxFormattable({ matchProperty: 'comment_options', requireDefined: true })
  public formatcommentOptionOperation ({ source: { comment_options: op }, target }: IFormatFunctionArguments<{ comment_options: comment_options }>) {
    const allowCurrationReward = !op.allow_curation_rewards ? 'disallow rewards, ' : '';
    const allowVotes = !op.allow_votes ? 'disallow votes, ' : '';
    const maxPayout = op.max_accepted_payout?.amount !== '1000000000' ? `max payout: ${this.getFormattedAmount(op.max_accepted_payout)}` : '';
    const percentHbd = op.percent_hbd !== 5000 ? `percent HBD: ${formatPercent(op.percent_hbd)}` : '';
    const message = this.generateVueLink([
      this.getAccountLink(op.author),
      'set options: ',
        `${allowCurrationReward} ${allowVotes} ${maxPayout} ${percentHbd} for: `,
        this.getPermlink(op.author, op.permlink)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'set_withdraw_vesting_route', requireDefined: true })
  public formatSetWithdrawVestingRouteOperation ({ source: { set_withdraw_vesting_route: op }, target }: IFormatFunctionArguments<{ set_withdraw_vesting_route: set_withdraw_vesting_route }>) {
    const autoVests = op.auto_vest ? ', convert to HP' : '';
    const message = this.generateVueLink([
      this.getAccountLink(op.from_account),
      'set withdraw vesting route to ',
      this.getAccountLink(op.from_account),
        `with ${formatPercent(op.percent)}${autoVests}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'limit_order_create2', requireDefined: true })
  public formatLimitOrderCreate2Operation ({ source: { limit_order_create2: op }, target }: IFormatFunctionArguments<{ limit_order_create2: limit_order_create2 }>) {
    const expiration = op.fill_or_kill ? '' : `, expiration: ${this.getFormattedDate(op.expiration)}`;
    const message = this.generateVueLink([
      this.getAccountLink(op.owner),
        `created limit order (id: ${op.orderid}) to sell: ${this.getFormattedAmount(op.amount_to_sell)},
   exchange rate: ${this.getFormattedAmount(op.exchange_rate?.base)} to ${this.getFormattedAmount(op.exchange_rate?.quote)}${expiration}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'claim_account', requireDefined: true })
  public formatClaimAccountOperation ({ source: { claim_account: op }, target }: IFormatFunctionArguments<{ claim_account: claim_account }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.creator),
        `claimed an account with ${this.getFormattedAmount(op.fee)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'create_claimed_account', requireDefined: true })
  public formatCreateClaimedAccountOperation ({ source: { create_claimed_account: op }, target }: IFormatFunctionArguments<{ create_claimed_account: create_claimed_account }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.creator),
      'created claimed account: ',
      this.getAccountLink(op.new_account_name)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'request_account_recovery', requireDefined: true })
  public formatRequestAccountRecovery ({ source: { request_account_recovery: op }, target }: IFormatFunctionArguments<{ request_account_recovery: request_account_recovery }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.recovery_account),
      'requested account recovery to account: ',
      this.getAccountLink(op.account_to_recover)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'recover_account', requireDefined: true })
  public formatRecoverAccountOperation ({ source: { recover_account: op }, target }: IFormatFunctionArguments<{ recover_account: recover_account }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.account_to_recover),
      'account was recovered'
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'change_recovery_account', requireDefined: true })
  public formatChangeRecoveryAccount ({ source: { change_recovery_account: op }, target }: IFormatFunctionArguments<{ change_recovery_account: change_recovery_account }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.account_to_recover),
      'changed recovery account to: ',
      this.getAccountLink(op.new_recovery_account)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'escrow_transfer', requireDefined: true })
  public formatEscrowTransferOperation ({ source: { escrow_transfer: op }, target }: IFormatFunctionArguments<{ escrow_transfer: escrow_transfer }>) {
    const message = this.getEscrowMessage('Escrow transfer from', op, { hbd_amount: op.hbd_amount, hive_amount: op.hive_amount });
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'escrow_dispute', requireDefined: true })
  public formatEscrowDispute ({ source: { escrow_dispute: op }, target }: IFormatFunctionArguments<{ escrow_dispute: escrow_dispute }>) {
    const message = this.getEscrowMessage('Escrow dispute from', op);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'escrow_release', requireDefined: true })
  public formatEscrowReleaseOperation ({ source: { escrow_release: op }, target }: IFormatFunctionArguments<{ escrow_release: escrow_release }>) {
    const message = this.getEscrowMessage('Escrow release from', op, { hbd_amount: op.hbd_amount, hive_amount: op.hive_amount });
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'pow2', requireDefined: true })
  public formatPow2Operation ({ source: { pow2: op }, target }: IFormatFunctionArguments<{ pow2: pow2}>) {
    const message = this.generateVueLink([
        `Prove of Work 2, account creation fee: ${this.getFormattedAmount(op.props?.account_creation_fee)},
   HBD interest rate: ${formatPercent(op.props?.hbd_interest_rate || 0)},
   maximum block size: ${op.props?.maximum_block_size}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'escrow_approve', requireDefined: true })
  public formatEscroweApproveOperation ({ source: { escrow_approve: op }, target }: IFormatFunctionArguments<{ escrow_approve: escrow_approve }>) {
    const message = this.getEscrowMessage('Escrow approve from', op);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'transfer_to_savings', requireDefined: true })
  public formatTransferToSavingsOperation ({ source: { transfer_to_savings: op }, target }: IFormatFunctionArguments<{ transfer_to_savings: transfer_to_savings }>) {
    const message = this.getTransferMessage(op);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'transfer_from_savings', requireDefined: true })
  public formatTransferFromSavingsOperation ({ source: { transfer_from_savings: op }, target }: IFormatFunctionArguments<{ transfer_from_savings: transfer_from_savings }>) {
    const message = this.getTransferMessage(op);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'cancel_transfer_from_savings', requireDefined: true })
  public formatCancelTransferFromSavingsOperation ({ source: { cancel_transfer_from_savings: op }, target }: IFormatFunctionArguments<{ cancel_transfer_from_savings: cancel_transfer_from_savings }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.from_account),
        `cancelled transfer with id: ${op.request_id}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'decline_voting_rights', requireDefined: true })
  public formatDeclineVotingRightsOperation ({ source: { decline_voting_rights: op }, target }: IFormatFunctionArguments<{ decline_voting_rights: decline_voting_rights }>) {
    let message: string | VNode = '';
    if (op.decline)
      message = this.generateVueLink([
        this.getAccountLink(op.account),
        'declined voting rights'
      ]);
    else
      message = this.generateVueLink([
        this.getAccountLink(op.account),
        'cancelled declining of voting rights'
      ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'claim_reward_balance', requireDefined: true })
  public formatClaimRewardBalanceOperation ({ source: { claim_reward_balance: op }, target }: IFormatFunctionArguments<{ claim_reward_balance: claim_reward_balance }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.account),
        `claimed rewards: ${this.getFormattedAmount(op.reward_hbd)},
   ${this.getFormattedAmount(op.reward_hive)},
   ${this.getFormattedAmount(op.reward_vests)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'delegate_vesting_shares', requireDefined: true })
  public formatDelegateVestingSharesOperation ({ source: { delegate_vesting_shares: op }, target }: IFormatFunctionArguments<{ delegate_vesting_shares: delegate_vesting_shares }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.delegator),
        `delegated ${this.getFormattedAmount(op.vesting_shares)} to `,
        this.getAccountLink(op.delegatee)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'account_create_with_delegation', requireDefined: true })
  public formatAccountCreateWithDelegationOperation ({ source: { account_create_with_delegation: op }, target }: IFormatFunctionArguments<{ account_create_with_delegation: account_create_with_delegation }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.creator),
      'created new account: ',
      this.getAccountLink(op.new_account_name),
        `with delegation: ${this.getFormattedAmount(op.delegation)} and fee: ${this.getFormattedAmount(op.fee)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'witness_set_properties', requireDefined: true })
  public formatWitnessSetPropertiesOperation ({ source: { witness_set_properties: op }, target }: IFormatFunctionArguments<{ witness_set_properties: witness_set_properties }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.owner),
      'updated witness properties'
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'account_update2', requireDefined: true })
  public formatAccountUpdate2Operation ({ source: { account_update2: op }, target }: IFormatFunctionArguments<{ account_update2: account_update2 }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.account),
      'updated an account'
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'create_proposal', requireDefined: true })
  public formatCreateProposalOperation ({ source: { create_proposal: op }, target }: IFormatFunctionArguments<{ create_proposal: create_proposal }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.creator),
        `created a proposal for ${this.getFormattedAmount(op.daily_pay)} daily to `,
        this.getAccountLink(op.receiver),
        ', details: ',
        this.getPermlink(op.creator, op.permlink),
        ` since ${this.getFormattedDate(op.start_date)} to ${this.getFormattedDate(op.end_date)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'update_proposal_votes', requireDefined: true })
  public formatUpdateProposalVotesOperation ({ source: { update_proposal_votes: op }, target }: IFormatFunctionArguments<{ update_proposal_votes: update_proposal_votes }>) {
    let message: string | VNode = '';
    if (op.approve)
      message = this.generateVueLink([
        this.getAccountLink(op.voter),
          `approved proposal ${op.proposal_ids}`
      ]);
    else
      message = this.generateVueLink([
        this.getAccountLink(op.voter),
          `removed approval for proposal ${op.proposal_ids}`
      ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'remove_proposal', requireDefined: true })
  public formatRemoveProposalOperation ({ source: { remove_proposal: op }, target }: IFormatFunctionArguments<{ remove_proposal: remove_proposal }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.proposal_owner),
        `removed proposal ${op.proposal_ids}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'update_proposal', requireDefined: true })
  public formatUpdateProposalOperation ({ source: { update_proposal: op }, target }: IFormatFunctionArguments<{ update_proposal: update_proposal }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.creator),
        `updated proposal ${op.proposal_id} for ${this.getFormattedAmount(op.daily_pay)} daily, details:`,
        this.getPermlink(op.creator, op.permlink)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'collateralized_convert', requireDefined: true })
  public formatCollateralizedConvertOperation ({ source: { collateralized_convert: op }, target }: IFormatFunctionArguments<{ collateralized_convert: collateralized_convert }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.owner),
        `collateralized convert ${this.getFormattedAmount(op.amount)} with request ID: ${op.requestid}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'recurrent_transfer', requireDefined: true })
  public formatRecurrentTransferOperation ({ source: { recurrent_transfer: op }, target }: IFormatFunctionArguments<{ recurrent_transfer: recurrent_transfer }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.from_account),
        `set recurrent transfer of ${this.getFormattedAmount(op.amount)}, ${op.executions} executions every ${op.recurrence} hours to `,
        this.getAccountLink(op.to_account)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'fill_convert_request', requireDefined: true })
  public formatFillConverRequest ({ source: { fill_convert_request: op }, target }: IFormatFunctionArguments<{ fill_convert_request: fill_convert_request }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.owner),
        `converted ${this.getFormattedAmount(op.amount_in)} to ${this.getFormattedAmount(op.amount_out)} for request ID: ${op.requestid}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'author_reward', requireDefined: true })
  public formatAuthorRewardOperation ({ source: { author_reward: op }, target }: IFormatFunctionArguments<{ author_reward: author_reward }>) {
    const mustBeClaimed = op.payout_must_be_claimed ? '' : ", doesn't have to be claimed";
    const message = this.generateVueLink([
      this.getAccountLink(op.author),
      'got an author reward for ',
      this.getPermlink(op.author, op.permlink),
        `curators payout: ${this.getFormattedAmount(op.curators_vesting_payout)},
   payouts: ${this.getFormattedAmount(op.vesting_payout)},
   ${this.getFormattedAmount(op.hive_payout)},
   ${this.getFormattedAmount(op.hbd_payout)}${mustBeClaimed}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'curation_reward', requireDefined: true })
  public formatCurationRewardOperation ({ source: { curation_reward: op }, target }: IFormatFunctionArguments<{ curation_reward: curation_reward }>) {
    const mustBeClaimed = op.payout_must_be_claimed ? '' : ", doesn't have to be claimed";
    const message = this.generateVueLink([
      this.getAccountLink(op.curator),
        `got a curation reward ${this.getFormattedAmount(op.reward)} for `,
        this.getPermlink(op.author, op.permlink),
        mustBeClaimed
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'comment_reward', requireDefined: true })
  public formatCommentReward ({ source: { comment_reward: op }, target }: IFormatFunctionArguments<{ comment_reward: comment_reward }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.author),
        `got a comment reward ${this.getFormattedAmount(op.payout)} for `,
        this.getPermlink(op.author, op.permlink)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'liquidity_reward', requireDefined: true })
  public formatLiquidityRewardOperation ({ source: { liquidity_reward: op }, target }: IFormatFunctionArguments<{ liquidity_reward: liquidity_reward }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.owner),
        `got a liquidity reward ${this.getFormattedAmount(op.payout)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'interest', requireDefined: true })
  public formatInterestOperation ({ source: { interest: op }, target }: IFormatFunctionArguments<{ interest: interest }>) {
    const wasLiquidModified = op.is_saved_into_hbd_balance ? ', liquid balance modified' : '';
    const message = this.generateVueLink([
      this.getAccountLink(op.owner),
        `got interest paid ${this.getFormattedAmount(op.interest)} `,
        wasLiquidModified
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'fill_vesting_withdraw', requireDefined: true })
  public formatFillVestingWithdrawOperation ({ source: { fill_vesting_withdraw: op }, target }: IFormatFunctionArguments<{ fill_vesting_withdraw: fill_vesting_withdraw }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.from_account),
        `withdrawed ${this.getFormattedAmount(op.withdrawn)} and `,
        this.getAccountLink(op.to_account),
        `deposited ${this.getFormattedAmount(op.deposited)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'fill_order', requireDefined: true })
  public formatFillOrderOperation ({ source: { fill_order: op }, target }: IFormatFunctionArguments<{ fill_order: fill_order }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.current_owner),
        `paid ${this.getFormattedAmount(op.current_pays)} for ${this.getFormattedAmount(op.open_pays)} from `,
        this.getAccountLink(op.open_owner),
        `(IDs: ${op.current_orderid} -> ${op.open_orderid})`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'shutdown_witness', requireDefined: true })
  public formatShutdownWitnessOperation ({ source: { shutdown_witness: op }, target }: IFormatFunctionArguments<{ shutdown_witness: shutdown_witness }>) {
    const message = this.generateVueLink([
      'Witness ',
      this.getAccountLink(op.owner),
      'was shutted down'
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'fill_transfer_from_savings', requireDefined: true })
  public formatFillTransferFromSavings ({ source: { fill_transfer_from_savings: op }, target }: IFormatFunctionArguments<{ fill_transfer_from_savings: fill_transfer_from_savings }>) {
    const memo = op.memo !== '' ? `, memo: "${op.memo}"` : '';
    const message = this.generateVueLink([
        `${this.getFormattedAmount(op.amount)} was transfered from `,
        this.getAccountLink(op.from_account),
        'to ',
        this.getAccountLink(op.to_account),
        `request ID: ${op.request_id}${memo}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'hardfork', requireDefined: true })
  public formatHardforkOperation ({ source: { hardfork: op }, target }: IFormatFunctionArguments<{ hardfork: hardfork }>) {
    const message = this.generateVueLink([
        `Hardfork ${op.hardfork_id}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'comment_payout_update', requireDefined: true })
  public formatCommentPayoutUpdateOperation ({ source: { comment_payout_update: op }, target }: IFormatFunctionArguments<{ comment_payout_update: comment_payout_update }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.author),
      'got payout update for',
      this.getPermlink(op.author, op.permlink)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'return_vesting_delegation', requireDefined: true })
  public formatReturnVestingDelegationOperation ({ source: { return_vesting_delegation: op }, target }: IFormatFunctionArguments<{ return_vesting_delegation: return_vesting_delegation }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.account),
        `received ${this.getFormattedAmount(op.vesting_shares)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'comment_benefactor_reward', requireDefined: true })
  public formatCommentBenefactorRewardOperation ({ source: { comment_benefactor_reward: op }, target }: IFormatFunctionArguments<{ comment_benefactor_reward: comment_benefactor_reward }>) {
    const mustBeClaimed = op.payout_must_be_claimed ? '' : ", doesn't have to be claimed";
    const message = this.generateVueLink([
      this.getAccountLink(op.benefactor),
        `received ${this.getFormattedAmount(op.vesting_payout)},
   ${this.getFormattedAmount(op.hbd_payout)},
   ${this.getFormattedAmount(op.hbd_payout)} for comment `,
        this.getPermlink(op.author, op.permlink),
        mustBeClaimed
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'producer_reward', requireDefined: true })
  public formatProducerReward ({ source: { producer_reward: op }, target }: IFormatFunctionArguments<{ producer_reward: producer_reward }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.producer),
        `received ${this.getFormattedAmount(op.vesting_shares)} reward`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'clear_null_account_balance', requireDefined: true })
  public formatClearNullAccountBalanceOperation ({ source: { clear_null_account_balance: op }, target }: IFormatFunctionArguments<{ clear_null_account_balance: clear_null_account_balance }>) {
    const message = this.generateVueLink([
        `Totally cleared: ${this.getFormattedMultipleAssets(op.total_cleared)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'proposal_pay', requireDefined: true })
  public formatProposalPayOperation ({ source: { proposal_pay: op }, target }: IFormatFunctionArguments<{ proposal_pay: proposal_pay }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.receiver),
        `was paid ${this.getFormattedAmount(op.payment)} for his proposal ${op.proposal_id} by `,
        this.getAccountLink(op.payer)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'dhf_funding', requireDefined: true })
  public formatDhfFundingOperation ({ source: { dhf_funding: op }, target }: IFormatFunctionArguments<{ dhf_funding: dhf_funding }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.treasury),
        `received ${this.getFormattedAmount(op.additional_funds)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'hardfork_hive', requireDefined: true })
  public formatHardforkHiveOperation ({ source: { hardfork_hive: op }, target }: IFormatFunctionArguments<{ hardfork_hive: hardfork_hive }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.account),
        `aidrop of ${this.getFormattedAmount(op.hbd_transferred)},
   ${this.getFormattedAmount(op.hive_transferred)},
   ${this.getFormattedAmount(op.total_hive_from_vests)},
   ${this.getFormattedAmount(op.vests_converted)} went to `,
        this.getAccountLink(op.treasury)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'hardfork_hive_restore', requireDefined: true })
  public formatHardforkHiveRestoreOperation ({ source: { hardfork_hive_restore: op }, target }: IFormatFunctionArguments<{ hardfork_hive_restore: hardfork_hive_restore }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.account),
        `received ${this.getFormattedAmount(op.hive_transferred)} and ${this.getFormattedAmount(op.hbd_transferred)} from `,
        this.getAccountLink(op.treasury)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'delayed_voting', requireDefined: true })
  public formatDelayedVotingOperation ({ source: { delayed_voting: op }, target }: IFormatFunctionArguments<{ delayed_voting: delayed_voting }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.voter),
        `has ${op.votes} vote power`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'consolidate_treasury_balance', requireDefined: true })
  public formatConsolidateTrasuryBalanceOperation ({ source: { consolidate_treasury_balance: op }, target }: IFormatFunctionArguments<{ consolidate_treasury_balance: consolidate_treasury_balance }>) {
    const message = this.generateVueLink([
        `${this.getFormattedMultipleAssets(op.total_moved)} was consolidated into treasury`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'effective_comment_vote', requireDefined: true })
  public formatEffectiveCommentVoteOperation ({ source: { effective_comment_vote: op }, target }: IFormatFunctionArguments<{ effective_comment_vote: effective_comment_vote }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.voter),
      'voted for ',
      this.getPermlink(op.author, op.permlink),
        ` and generated ${this.getFormattedAmount(op.pending_payout)} pending payout`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'ineffective_delete_comment', requireDefined: true })
  public formatIneffectiveDeleteCommentOperation ({ source: { ineffective_delete_comment: op }, target }: IFormatFunctionArguments<{ ineffective_delete_comment: ineffective_delete_comment }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.author),
      'ineffectively deleted ',
      this.getPermlink(op.author, op.permlink)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'dhf_conversion', requireDefined: true })
  public formatDhfConversionOperation ({ source: { dhf_conversion: op }, target }: IFormatFunctionArguments<{ dhf_conversion: dhf_conversion }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.treasury),
        `converted ${this.getFormattedAmount(op.hive_amount_in)} to ${this.getFormattedAmount(op.hbd_amount_out)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'expired_account_notification', requireDefined: true })
  public formatExpiredAccountNotificationOperation ({ source: { expired_account_notification: op }, target }: IFormatFunctionArguments<{ expired_account_notification: expired_account_notification }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.account),
      'vote was nullified'
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'changed_recovery_account', requireDefined: true })
  public formatChangedRecoveryAccountOperation ({ source: { changed_recovery_account: op }, target }: IFormatFunctionArguments<{ changed_recovery_account: changed_recovery_account }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.account),
      'changed recovery account from ',
      this.getAccountLink(op.old_recovery_account),
      'to ',
      this.getAccountLink(op.new_recovery_account)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'transfer_to_vesting_completed', requireDefined: true })
  public formatTransferToVestingCompletedOperation ({ source: { transfer_to_vesting_completed: op }, target }: IFormatFunctionArguments<{ transfer_to_vesting_completed: transfer_to_vesting_completed }>) {
    const message = this.generateVueLink([
      'Vesting transfer from ',
      this.getAccountLink(op.from_account),
      'to ',
      this.getAccountLink(op.to_account),
        `was completed with ${this.getFormattedAmount(op.hive_vested)} -> ${this.getFormattedAmount(op.vesting_shares_received)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'pow_reward', requireDefined: true })
  public formatPowRewardOperation ({ source: { pow_reward: op }, target }: IFormatFunctionArguments<{ pow_reward: pow_reward }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.worker),
        `received ${this.getFormattedAmount(op.reward)} reward`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'vesting_shares_split', requireDefined: true })
  public formatVestingSharesSplitOperation ({ source: { vesting_shares_split: op }, target }: IFormatFunctionArguments<{ vesting_shares_split: vesting_shares_split }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.owner),
        `splited vests ${this.getFormattedAmount(op.vesting_shares_before_split)} -> ${this.getFormattedAmount(op.vesting_shares_after_split)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'account_created', requireDefined: true })
  public formatAccountCreatedOperation ({ source: { account_created: op }, target }: IFormatFunctionArguments<{ account_created: account_created }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.new_account_name),
      'was created by ',
      this.getAccountLink(op.creator),
        `with initials: vesting shares ${this.getFormattedAmount(op.initial_vesting_shares)}
   and delegations ${this.getFormattedAmount(op.initial_delegation)}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'fill_collateralized_convert_request', requireDefined: true })
  public formatFillCollateralizedConvertRequestOperation ({ source: { fill_collateralized_convert_request: op }, target }: IFormatFunctionArguments<{ fill_collateralized_convert_request: fill_collateralized_convert_request }>) {
    const message = this.generateVueLink([
        `Collateralized convert reuqest of ${op.owner}
   (ID: ${op.requestid}) was filled with ${this.getFormattedAmount(op.amount_in)}
   -> ${this.getFormattedAmount(op.amount_out)}
   and ${this.getFormattedAmount(op.excess_collateral)} excess`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'system_warning', requireDefined: true })
  public formatSystemWarningOperation ({ source: { system_warning: op }, target }: IFormatFunctionArguments<{ system_warning: system_warning }>) {
    const message = this.generateVueLink([
        `${op.message}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'fill_recurrent_transfer', requireDefined: true })
  public formatFillRecurrentTransferOperation ({ source: { fill_recurrent_transfer: op }, target }: IFormatFunctionArguments<{ fill_recurrent_transfer: fill_recurrent_transfer }>) {
    const message = this.generateVueLink([
      'Recurrent transfer from ',
      this.getAccountLink(op.from_account),
      'to ',
      this.getAccountLink(op.to_account),
        `with amount: ${this.getFormattedAmount(op.amount)} and ${op.remaining_executions} remaining executions`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'failed_recurrent_transfer', requireDefined: true })
  public formatFailedRecurrentTransferOperation ({ source: { failed_recurrent_transfer: op }, target }: IFormatFunctionArguments<{ failed_recurrent_transfer: failed_recurrent_transfer }>) {
    const deleted = op.deleted ? ' and was deleted' : '';
    const message = this.generateVueLink([
      'Recurrent transfer from ',
      this.getAccountLink(op.from_account),
      'to ',
      this.getAccountLink(op.to_account),
        `with amount: ${this.getFormattedAmount(op.amount)}
   and ${op.remaining_executions} remaining executions failed for ${op.consecutive_failures} times`,
        deleted
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'limit_order_cancelled', requireDefined: true })
  public formatLimitOrderCancelledOperation ({ source: { limit_order_cancelled: op }, target }: IFormatFunctionArguments<{ limit_order_cancelled: limit_order_cancelled }>) {
    const message = this.generateVueLink([
        `Order ${op.orderid} by `,
        this.getAccountLink(op.seller),
        `was cancelled and ${this.getFormattedAmount(op.amount_back)} was sent back`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'producer_missed', requireDefined: true })
  public formatProducerMissedOperation ({ source: { producer_missed: op }, target }: IFormatFunctionArguments<{ producer_missed: producer_missed }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.producer),
      'missed block'
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'proposal_fee', requireDefined: true })
  public formatProposalFeeOperations ({ source: { proposal_fee: op }, target }: IFormatFunctionArguments<{ proposal_fee: proposal_fee }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.creator),
        `got proposal fee ${this.getFormattedAmount(op.fee)} ID: ${op.proposal_id} from `,
        this.getAccountLink(op.treasury)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'collateralized_convert_immediate_conversion', requireDefined: true })
  public formatCollateralizedConvertImmediateConversionOperation ({ source: { collateralized_convert_immediate_conversion: op }, target }: IFormatFunctionArguments<{ collateralized_convert_immediate_conversion: collateralized_convert_immediate_conversion }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.owner),
        `received ${this.getFormattedAmount(op.hbd_out)} for conversion ID: ${op.requestid}`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'escrow_approved', requireDefined: true })
  public formatEscrowApprovedOperation ({ source: { escrow_approved: op }, target }: IFormatFunctionArguments<{ escrow_approved: escrow_approved }>) {
    const message = this.generateVueLink([
      'Escrow from ',
      this.getAccountLink(op.from_account),
      'to ',
      this.getAccountLink(op.to_account),
      'by agent ',
      this.getAccountLink(op.agent),
        `with fee: ${this.getFormattedAmount(op.fee)},
   ID: ${op.escrow_id} was approved`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'escrow_rejected', requireDefined: true })
  public formatEscrowRejectedOperation ({ source: { escrow_rejected: op }, target }: IFormatFunctionArguments<{ escrow_rejected: escrow_rejected }>) {
    const message = this.generateVueLink([
      'Escrow from ',
      this.getAccountLink(op.from_account),
      'to ',
      this.getAccountLink(op.to_account),
      'by agent ',
      this.getAccountLink(op.agent),
        `with fee: ${this.getFormattedAmount(op.fee)},
   ID: ${op.escrow_id} was rejected`
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'proxy_cleared', requireDefined: true })
  public formatProxyClearedOperation ({ source: { proxy_cleared: op }, target }: IFormatFunctionArguments<{ proxy_cleared: proxy_cleared }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.account),
      'cleared proxy ',
      this.getAccountLink(op.proxy)
    ]);
    return { ...target, value: message };
  }

  @WaxFormattable({ matchProperty: 'declined_voting_rights', requireDefined: true })
  public formatDeclinedVotingRightsOperation ({ source: { declined_voting_rights: op }, target }: IFormatFunctionArguments<{ declined_voting_rights: declined_voting_rights }>) {
    const message = this.generateVueLink([
      this.getAccountLink(op.account),
      'votes rights were declined'
    ]);
    return { ...target, value: message };
  }
}

const operationsFormatter = (): IWaxExtendableFormatter => {
  const { $chain } = useNuxtApp();

  let basicFormatter = $chain.formatter;

  basicFormatter = basicFormatter.extend(OperationsFormatter, {
    transaction: { displayAsId: false }
  });

  return basicFormatter;
};

export default defineNuxtPlugin(() => {
  return {
    provide: {
      formatter: operationsFormatter()
    }
  };
});
