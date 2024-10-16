// This is a workaround for https://github.com/microsoft/playwright/issues/18282#issuecomment-1612266345
import { defineConfig } from '@playwright/test';
import { type ITxInspectorTest } from './__tests__/assets/jest-helper.js';

export default defineConfig < ITxInspectorTest>({
  reporter: [
    ['junit', { outputFile: 'results.xml' }],
    ['json', { outputFile: 'results.json' }]
  ],
  projects: [
    {
      name: 'tx_inspector_testsuite',
      testDir: './__tests__/',
      use:
      {
        fixtureLevelMockFile: 'Ala ma kota.json'
      }

    }
  ],
  // Run your local dev server before starting the tests
  webServer: {
    command: 'npx http-server ./'
  }
});
