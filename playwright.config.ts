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
        fixtureLevelMockFile: './__tests__/assets/mock/single_operation_single_signature_data.json'
      }

    },
    {
      name: 'tx_inspector_multiple_signature',
      testDir: './__tests__/',
      testMatch: '**/txInspector-multiple-signature-mock.ts',
      use:
      {
        fixtureLevelMockFile: './__tests__/assets/mock/multiple_operation_single_signature_data.json'
      }
    },
    {
      name: 'tx_inspector_delegated_authority',
      testDir: './__tests__/',
      testMatch: '**/txInspector-delegated-authority-mock.ts',
      use:
      {
        fixtureLevelMockFile: './__tests__/assets/mock/delegated_authority_single_signature_data.json'
      }
    },
    {
      name: 'tx_inspector_non_default_weights',
      testDir: './__tests__/',
      testMatch: '**/txInspector-single-signature-non-default-weights-mock.ts',
      use:
      {
        fixtureLevelMockFile: './__tests__/assets/mock/single_operation_single_signature_non_default_weights_data.json'
      }
    },
    {
      name: 'tx_inspector_multiple_signature_non_default_weights',
      testDir: './__tests__/',
      testMatch: '**/txInspector-multiple-signature-non-default-weights-mock.ts',
      use:
      {
        fixtureLevelMockFile: './__tests__/assets/mock/multiple_operation_multiple_signature_non_default_weights_data.json'
      }
    },
    {
      name: 'tx_inspector_each_signature_satisfies_alone_non_default_weights',
      testDir: './__tests__/',
      testMatch: '**/txInspector-each-signature-satisfies-alone-non-default-weights-mock.ts',
      use:
      {
        fixtureLevelMockFile: './__tests__/assets/mock/each_signature_satifies_alone_non_default_weights_data.json'
      }
    },
    {
      name: 'tx_inspector_signatures_together_can_satisfy_non_default_weights',
      testDir: './__tests__/',
      testMatch: '**/txInspector-signatures-together-can-satisfy-non-default-weights-mock.ts',
      use:
      {
        fixtureLevelMockFile: './__tests__/assets/mock/signatures_together_can_satisfy_non_default_weights_data.json'
      }
    }
  ],
  // Run your local dev server before starting the tests
  webServer: {
    command: 'npx http-server ./'
  }
});
