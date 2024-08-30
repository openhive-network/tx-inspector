/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import type { ApiTransaction, authority, TAccountName } from '@hiveio/wax';
import type { WaxAccountInformation } from '~/plugins/wax';

export interface IAuthorityNode {
  name: TAccountName;
  accounts: TAccountName[];
  rootNode?: IAuthorityNode;
}

export interface IAuthorityPaths {
  account: string;
  authWeight: {
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
  other: authority[];
}

interface IAuthorityGetter {
  (id: string): Promise<authority>;
}

const max_recursion_depth = 2;
const max_membership = 40;
const max_account_auths = 125;

const verifyAuthorityImpl = async (
  required_authorities: IVerifyAuthorityRequired,
  sigs: Set<string>,
  get_active: IAuthorityGetter,
  get_owner: IAuthorityGetter,
  get_posting: IAuthorityGetter
): Promise<void> => {
  const active_approvals = new Set<string>();
  const owner_approvals = new Set<string>();
  const posting_approvals = new Set<string>();

  const VERIFY_AUTHORITY_CHECK = (test: boolean, problem: string, id: string): void => {
    if (!test)
      throw new Error(`"${id}": ${problem}`);
  };

  const VERIFY_AUTHORITY_CHECK_OTHER_AUTH = (test: boolean, _auth: authority): void => {
    if (!test)
      throw new Error('Other authority error');
  };

  if (required_authorities.required_posting.length > 0) {
    VERIFY_AUTHORITY_CHECK(
      required_authorities.required_active.length === 0 &&
      required_authorities.required_owner.length === 0 &&
      required_authorities.other.length === 0,
      'mixed_with_posting',
      ''
    );

    const avail = new Set<string>();
    const s: ISignState = new CSignState(sigs, get_posting, avail);
    s.maxRecursion = max_recursion_depth;
    s.maxMembership = max_membership;
    s.maxAccountAuths = max_account_auths;

    posting_approvals.forEach(id => s.approvedBy.add(id));

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

  const avail = new Set<string>();
  const s: ISignState = new CSignState(sigs, get_active, avail);
  s.maxRecursion = max_recursion_depth;
  s.maxMembership = max_membership;
  s.maxAccountAuths = max_account_auths;

  active_approvals.forEach(id => s.approvedBy.add(id));
  owner_approvals.forEach(id => s.approvedBy.add(id));

  for (const auth of required_authorities.other)
    VERIFY_AUTHORITY_CHECK_OTHER_AUTH(
      await s.checkAuthority(auth, 0, 0),
      auth
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

const paths: IAuthorityPaths[] = [];

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

        console.log(`Key: "${key}" auth: ${weight}/${auth.weight_threshold}`);

        if (totalWeight >= auth.weight_threshold) {
          console.log('Satisfied with key');

          return true;
        }
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
          console.log(`Account: "${account}" auth: ${weight}/${auth.weight_threshold}`);

          if (totalWeight >= auth.weight_threshold) {
            console.log('Satisfied with account');

            return true;
          }
        }
      } else {
        totalWeight += weight;

        paths.push({ account, authWeight: { weight, auth: auth.weight_threshold } });
        console.log(`Account: "${account}" auth: ${weight}/${auth.weight_threshold}`);

        if (totalWeight >= auth.weight_threshold) {
          console.log('Satisfied with account');

          return true;
        }
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

const getAuthority = async (wax: WaxAccountInformation, type: 'active' | 'owner' | 'posting', id: string): Promise<authority> => {
  console.log(`Asking for ${type.toUpperCase()} authority for account @${id}`);

  const { accounts: [account] } = await wax.getAccountsFromId(id);

  if (account === undefined)
    throw new Error(`No account on chain: "${id}"`);

  return {
    weight_threshold: account[type].weight_threshold,
    account_auths: Object.fromEntries(account[type].account_auths as any),
    key_auths: Object.fromEntries(account[type].key_auths as any)
  };
};

const createModuleForTransaction = async (wax: WaxAccountInformation, transaction: ApiTransaction): Promise<void> => {
  const auths = await wax.getRequiredAuthorities(transaction);

  await verifyAuthorityImpl({
    other: auths.other,
    required_active: [...auths.active],
    required_owner: [...auths.owner],
    required_posting: [...auths.posting]
  }, new Set(await wax.getSignatureKeys(transaction)),
  getAuthority.bind(undefined, wax, 'active'),
  getAuthority.bind(undefined, wax, 'owner'),
  getAuthority.bind(undefined, wax, 'posting'));
};

export default async function (wax: WaxAccountInformation, transaction: ApiTransaction): Promise<IAuthorityPaths[] | undefined> {
  try {
    await createModuleForTransaction(wax, transaction);
    console.log('\n<DONE>\n======================================');
    return paths;
  } catch (error) {
    console.log(`\n<FAILED>: ${error}\n======================================`);
  }
}

// const paths: Map<TAccountName, IAuthorityNode> = new Map();

// export default async function (wax: WaxAccountInformation, trx: ApiTransaction): Promise<Map<TAccountName, IAuthorityNode> | undefined> {
//   try {
//     const checkAccounts = async (keyType: 'active' | 'posting' | 'owner', lookingFor: Readonly<TAccountName[]>, rootNode: IAuthorityNode | undefined, accounts: TAccountName[]): Promise<IAuthorityNode | void> => {
//       const apiAccounts = await wax.getAccounts(accounts);

//       for (const { name, [keyType]: keyData } of apiAccounts) {
//         if (lookingFor.includes(name))
//           return {
//             name,
//             accounts: [],
//             rootNode
//           };

//         const children = keyData.account_auths.map(acc => acc[0]);

//         if (children.length === 0)
//           return;

//         const node = await checkAccounts(keyType, lookingFor, {
//           name,
//           accounts: children,
//           rootNode
//         }, children);

//         if (node !== undefined)
//           return node;
//       }
//     };

//     const requiredAuthorities = await wax.getRequiredAuthorities(trx);
//     const signatureKeys = await wax.getSignatureKeys(trx);

//     if (requiredAuthorities.posting.size !== 0)
//       for (const requiredAuthority of requiredAuthorities.posting)
//         for (let i = 0; i < signatureKeys.length; ++i) {
//           const signees = await wax.findSigneesForKeys(signatureKeys);

//           const checkedAcc = await checkAccounts('posting', signees[i], undefined, [requiredAuthority]);

//           if (typeof checkedAcc !== 'undefined')
//             paths.set(requiredAuthority, checkedAcc);
//         }
//     else if (requiredAuthorities.active.size !== 0)
//       for (const requiredAuthority of requiredAuthorities.active)
//         for (let i = 0; i < signatureKeys.length; ++i) {
//           const signees = await wax.findSigneesForKeys(signatureKeys);

//           const checkedAcc = await checkAccounts('active', signees[i], undefined, [requiredAuthority]);

//           if (typeof checkedAcc !== 'undefined')
//             paths.set(requiredAuthority, checkedAcc);
//         }
//     else if (requiredAuthorities.owner.size !== 0)
//       for (const requiredAuthority of requiredAuthorities.owner)
//         for (let i = 0; i < signatureKeys.length; ++i) {
//           const signees = await wax.findSigneesForKeys(signatureKeys);

//           const checkedAcc = await checkAccounts('owner', signees[i], undefined, [requiredAuthority]);

//           if (typeof checkedAcc !== 'undefined')
//             paths.set(requiredAuthority, checkedAcc);
//         }
//     else
//       console.error('No required authorities found');

//     return paths;
//   } catch (error) {
//     console.error(error);
//   }
// }
