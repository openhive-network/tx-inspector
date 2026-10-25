import path from 'node:path';
import fs from 'node:fs';

import type { Page, Route } from '@playwright/test';

import type { IMockData } from './api-mock';

interface IJsonRpcRequest {
  id: number | string;
  method: string;
  params: unknown;
}

type TChainApiHandler = (params: any, mockData: IMockData) => unknown;

/**
 * Recorded from https://api.hive.blog/ (2026-10-25). `total_reward_shares2` was added by hand:
 * hived no longer returns it, but the response validation of the pinned wax still requires it.
 */
const dynamicGlobalProperties = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), '__tests__/assets/mock/dynamic_global_properties_data.json'), 'utf-8')
);

/* eslint-disable @typescript-eslint/naming-convention -- keys are JSON-RPC method names */
const handlers: Record<string, TChainApiHandler> = {
  'database_api.get_dynamic_global_properties': () => dynamicGlobalProperties,

  // The authority trace of wax looks accounts up itself, in batches. Mock data records each account
  // under the name the test asks for, with the body of some real account, so the name is the key.
  'database_api.find_accounts': ({ accounts }: { accounts: string[] }, mockData) => ({
    accounts: accounts.flatMap((name) => {
      const entry = mockData.findAccounts.find(({ paramsAccounts }) => paramsAccounts.length === 1 && paramsAccounts[0] === name);

      return entry ? entry.accounts.map(account => ({ ...account, name })) : [];
    })
  })
};
/* eslint-enable @typescript-eslint/naming-convention */

const fulfillJsonRpc = (route: Route, body: object) =>
  route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });

/**
 * Answers the chain API calls wax makes from the page from the project's mock data and recorded fixtures,
 * so no request leaves the test host. A call with no recorded answer gets a JSON-RPC error naming it.
 */
export const routeChainApiToMock = async (page: Page, mockData: IMockData): Promise<void> => {
  await page.route(url => url.hostname !== 'localhost', (route) => {
    const request = route.request();
    const call = request.method() === 'POST' ? request.postDataJSON() as IJsonRpcRequest : undefined;
    const handler = call && handlers[call.method];

    if (!call || !handler)
      return fulfillJsonRpc(route, {
        jsonrpc: '2.0',
        id: call?.id ?? null,
        error: { code: -32601, message: `No recorded chain API response for ${call?.method ?? `${request.method()} ${request.url()}`}` }
      });

    return fulfillJsonRpc(route, { jsonrpc: '2.0', id: call.id, result: handler(call.params, mockData) });
  });
};
