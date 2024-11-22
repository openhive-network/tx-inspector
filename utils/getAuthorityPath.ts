/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import type { authority, TAccountName } from '@hiveio/wax';
import { toast } from 'vue-sonner';
import { TransactionAnalyzer } from '../utils/txInspector';
import type { ITransactionRequiredAuthorities } from '../types/wax';

export interface IAuthorityNode {
  name: TAccountName;
  accounts: TAccountName[];
  rootNode?: IAuthorityNode;
}

export interface IAuthorityPaths {
  account: string | string[];
  authWeight?: {
    weight: number;
    auth: number;
  };
}

interface ISignState {
  signedBy(k: string): boolean;
  checkAuthority(id: string): Promise<boolean>;
  checkAuthority(auth: authority, depth?: number, accountAuthCount?: number): Promise<boolean>;
  removeUnusedSignatures(): boolean;
  getActive(id: string): authority;

  approvedBy: Set<string>;
  maxRecursion: number;
  maxMembership: number;
  maxAccountAuths: number;
}

interface IVerifyAuthorityRequired {
  required_posting: string[];
  required_active: string[];
  required_owner: string[];
  required_other: string[];
}

interface IAuthorityGetter {
  (id: string): Promise<authority>;
}

const max_recursion_depth = 2;
const max_membership = 40;
const max_account_auths = 125;

const paths: IAuthorityPaths[] = [];

const verifyAuthorityImpl = async (
  required_authorities: IVerifyAuthorityRequired,
  sigs: Set<string>,
  get_active: IAuthorityGetter,
  get_owner: IAuthorityGetter,
  get_posting: IAuthorityGetter,
  get_other: IAuthorityGetter
): Promise<void> => {
  const active_approvals = new Set<string>();
  const owner_approvals = new Set<string>();
  const posting_approvals = new Set<string>();

  const VERIFY_AUTHORITY_CHECK = (test: boolean, problem: string, id: string): void => {
    if (!test) {
      toast.error('Error', {
        description: `${id}: ${problem}`
      });

      if (problem === 'missing_posting' || problem === 'missing_active' || problem === 'missing_owner')
        paths.forEach((item) => {
          if (Array.isArray(item.account))
            item.account.forEach((account, index) => {
              if (account === id)
                (item.account as Array<string>)[index] = '';
            });
        });
    }
  };

  if (required_authorities.required_posting.length > 0) {
    VERIFY_AUTHORITY_CHECK(
      required_authorities.required_active.length === 0 &&
      required_authorities.required_owner.length === 0 &&
      required_authorities.required_other.length === 0,
      'mixed_with_posting',
      ''
    );

    const avail = new Set<string>();
    const s: ISignState = new CSignState(sigs, get_posting, avail);
    s.maxRecursion = max_recursion_depth;
    s.maxMembership = max_membership;
    s.maxAccountAuths = max_account_auths;

    posting_approvals.forEach(id => s.approvedBy.add(id));

    paths.push({ account: required_authorities.required_posting });

    for (const id of required_authorities.required_posting)
      VERIFY_AUTHORITY_CHECK(
        await s.checkAuthority(id) || await s.checkAuthority(await get_active(id)) || await s.checkAuthority(await get_owner(id)),
        'missing_posting',
        id
      );

    VERIFY_AUTHORITY_CHECK(
      !s.removeUnusedSignatures(),
      'unused_signature',
      ''
    );

    return;
  }

  if (required_authorities.required_active.length > 0)
    paths.push({ account: required_authorities.required_active });

  if (required_authorities.required_owner.length > 0)
    paths.push({ account: required_authorities.required_owner });

  const avail = new Set<string>();
  const s: ISignState = new CSignState(sigs, get_active, avail);
  s.maxRecursion = max_recursion_depth;
  s.maxMembership = max_membership;
  s.maxAccountAuths = max_account_auths;

  active_approvals.forEach(id => s.approvedBy.add(id));
  owner_approvals.forEach(id => s.approvedBy.add(id));

  for (const id of required_authorities.required_other)
    VERIFY_AUTHORITY_CHECK(
      await s.checkAuthority(id) || await s.checkAuthority(await get_other(id)),
      'missing_other',
      id
    );

  for (const id of required_authorities.required_active)
    VERIFY_AUTHORITY_CHECK(
      await s.checkAuthority(id) || await s.checkAuthority(await get_owner(id)),
      'missing_active',
      id
    );

  for (const id of required_authorities.required_owner)
    VERIFY_AUTHORITY_CHECK(
      owner_approvals.has(id) || await s.checkAuthority(await get_owner(id)),
      'missing_owner',
      id
    );

  VERIFY_AUTHORITY_CHECK(
    !s.removeUnusedSignatures(),
    'unused_signature',
    ''
  );
};

class CSignState implements ISignState {
  constructor (
    sigs: Set<string>,
    private readonly get_active: IAuthorityGetter,
    private readonly available_keys: Set<string>
  ) {
    sigs.forEach(key => this.providedSignatures.set(key, false));
    this.approvedBy.add('temp');
  }

  public signedBy (k: string): boolean {
    if (this.providedSignatures.has(k)) {
      this.providedSignatures.set(k, true);
      return true;
    }

    if (this.available_keys.has(k)) {
      this.providedSignatures.set(k, true);
      return true;
    }

    return false;
  }

  public async checkAuthority (id: string | authority, depth: number = 0, accountAuthCount: number = 0): Promise<boolean> {
    if (typeof id === 'object')
      return await this.checkAuthorityImpl(id, depth, accountAuthCount);

    if (this.approvedBy.has(id)) return true;
    accountAuthCount = 1;
    return await this.checkAuthorityImpl(await this.get_active(id), 0, accountAuthCount);
  }

  public async checkAuthorityImpl (auth: authority, depth: number, accountAuthCount: number): Promise<boolean> {
    let totalWeight = 0;
    let membership = 0;

    for (const [key, weight] of Object.entries(auth.key_auths)) {
      if (this.signedBy(key)) {
        totalWeight += weight;

        if (totalWeight >= auth.weight_threshold)
          return true;
      }
      if (this.maxMembership > 0 && membership++ >= this.maxMembership)
        return false;
    }

    for (const [account, weight] of Object.entries(auth.account_auths)) {
      if (!this.approvedBy.has(account)) {
        if (depth === this.maxRecursion)
          return false;

        if (this.maxAccountAuths > 0 && accountAuthCount >= this.maxAccountAuths)
          return false;

        accountAuthCount++;

        // Recursively check authority
        if (await this.checkAuthority(await this.get_active(account), depth + 1, accountAuthCount)) {
          this.approvedBy.add(account);
          totalWeight += weight;

          paths.push({ account, authWeight: { weight, auth: auth.weight_threshold } });

          if (totalWeight >= auth.weight_threshold)
            return true;
        }
      } else {
        totalWeight += weight;

        paths.push({ account, authWeight: { weight, auth: auth.weight_threshold } });

        if (totalWeight >= auth.weight_threshold)
          return true;
      }

      if (this.maxMembership > 0 && membership++ >= this.maxMembership)
        return false;
    }

    return totalWeight >= auth.weight_threshold;
  }

  public removeUnusedSignatures (): boolean {
    const removeSigs: string[] = [];
    this.providedSignatures.forEach((used, key) => {
      if (!used) removeSigs.push(key);
    });

    removeSigs.forEach(key => this.providedSignatures.delete(key));

    return removeSigs.length > 0;
  }

  providedSignatures: Map<string, boolean> = new Map<string, boolean>();
  availableKeys!: Set<string>;
  approvedBy: Set<string> = new Set<string>();
  maxRecursion!: number;
  maxMembership!: number;
  maxAccountAuths!: number;
  getActive!: (id: string) => authority;
}

const getAuthority = async (analyzer: TransactionAnalyzer, type: 'active' | 'owner' | 'posting', id: string): Promise<authority> => {
  const { accounts: [account] } = await analyzer.getAccountsFromId(id);

  if (account === undefined)
    throw new Error(`No account on chain: "${id}"`);

  return {
    weight_threshold: account[type].weight_threshold,
    account_auths: Object.fromEntries(account[type].account_auths as any),
    key_auths: Object.fromEntries(account[type].key_auths as any)
  };
};

const createModuleForTransaction = async (analyzer: TransactionAnalyzer, requiredAuthorities: ITransactionRequiredAuthorities, signatureKeys: string[]): Promise<void> => {
  await verifyAuthorityImpl({
    required_other: [...requiredAuthorities.other],
    required_active: [...requiredAuthorities.active],
    required_owner: [...requiredAuthorities.owner],
    required_posting: [...requiredAuthorities.posting]
  }, new Set(signatureKeys),
  getAuthority.bind(undefined, analyzer, 'active'),
  getAuthority.bind(undefined, analyzer, 'owner'),
  getAuthority.bind(undefined, analyzer, 'posting'),
  getAuthority.bind(undefined, analyzer, 'active')); // TODO: get other authority correctly. It is required to check which authority of the account satisfies the required_other
};

export async function getAuthorityPath (analyzer: TransactionAnalyzer, requiredAuthorities: ITransactionRequiredAuthorities, signatureKeys: string[]): Promise<IAuthorityPaths[] | undefined> {
  try {
    await createModuleForTransaction(analyzer, requiredAuthorities, signatureKeys);
    return paths;
  } catch (error) {
    toast.error('Error', {
      description: error instanceof Error ? error.message : 'Unknown error occured'
    });
  }
}
