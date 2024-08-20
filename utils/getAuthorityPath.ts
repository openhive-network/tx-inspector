import type { ApiTransaction, TAccountName } from '@hiveio/wax';
import type { WaxAccountInformation } from '~/plugins/wax';

export interface IAuthorityNode {
  name: TAccountName;
  accounts: TAccountName[];
  rootNode?: IAuthorityNode;
}

const paths: Map<TAccountName, IAuthorityNode> = new Map();

export default async function (wax: WaxAccountInformation, trx: ApiTransaction): Promise<Map<TAccountName, IAuthorityNode> | undefined> {
  try {
    const checkAccounts = async (keyType: 'active' | 'posting' | 'owner', lookingFor: Readonly<TAccountName[]>, rootNode: IAuthorityNode | undefined, accounts: TAccountName[]): Promise<IAuthorityNode | void> => {
      const apiAccounts = await wax.getAccounts(accounts);

      for (const { name, [keyType]: keyData } of apiAccounts) {
        if (lookingFor.includes(name))
          return {
            name,
            accounts: [],
            rootNode
          };

        const children = keyData.account_auths.map(acc => acc[0]);

        if (children.length === 0)
          return;

        const node = await checkAccounts(keyType, lookingFor, {
          name,
          accounts: children,
          rootNode
        }, children);

        if (node !== undefined)
          return node;
      }
    };

    const requiredAuthorities = await wax.getRequiredAuthorities(trx);
    const signatureKeys = await wax.getSignatureKeys(trx);

    if (requiredAuthorities.posting.size !== 0)
      for (const requiredAuthority of requiredAuthorities.posting)
        for (let i = 0; i < signatureKeys.length; ++i) {
          const signees = await wax.findSigneesForKeys(signatureKeys);

          const checkedAcc = await checkAccounts('posting', signees[i], undefined, [requiredAuthority]);

          if (typeof checkedAcc !== 'undefined')
            paths.set(requiredAuthority, checkedAcc);
        }
    else if (requiredAuthorities.active.size !== 0)
      for (const requiredAuthority of requiredAuthorities.active)
        for (let i = 0; i < signatureKeys.length; ++i) {
          const signees = await wax.findSigneesForKeys(signatureKeys);

          const checkedAcc = await checkAccounts('active', signees[i], undefined, [requiredAuthority]);

          if (typeof checkedAcc !== 'undefined')
            paths.set(requiredAuthority, checkedAcc);
        }
    else if (requiredAuthorities.owner.size !== 0)
      for (const requiredAuthority of requiredAuthorities.owner)
        for (let i = 0; i < signatureKeys.length; ++i) {
          const signees = await wax.findSigneesForKeys(signatureKeys);

          const checkedAcc = await checkAccounts('owner', signees[i], undefined, [requiredAuthority]);

          if (typeof checkedAcc !== 'undefined')
            paths.set(requiredAuthority, checkedAcc);
        }
    else
      console.error('No required authorities found');

    return paths;
  } catch (error) {
    console.error(error);
  }
}
