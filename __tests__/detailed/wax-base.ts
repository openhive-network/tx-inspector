import { type ChromiumBrowser, type ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';

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

  test('Should be able to get chain', async ({ txInspectorTest }) => {
    const retVal = await txInspectorTest(async ({ wax }) => {
      return await wax.getChain();
    });

    expect(retVal).toBe('eos');
  });
});
