module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential',
    'plugin:nuxt/recommended',
    '@nuxtjs/eslint-config-typescript',
  ],
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  rules: {
    'semi': ['error', 'always'],
    'curly': ['error', 'multi'],
    'import/first': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-arrow-functions-in-watch': 'off',
    'vue/no-export-in-script-setup': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/max-attributes-per-line': ['error', {
      'singleline': {
        'max': 4
      },
      'multiline': {
        'max': 1
      }
    }],
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true
        }
      },
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        custom: {
          regex: '^T[A-Z]',
          match: true
        }
      },
      {
        selector: 'enum',
        format: ['PascalCase'],
        custom: {
          regex: '^E[A-Z]',
          match: true
        }
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE']
      },
      {
        selector: 'class',
        format: ['PascalCase']
      },
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow'
      },
      {
        selector: 'import',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE']
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow'
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        custom: {
          regex: '^T[A-Z]',
          match: true
        }
      }
    ],
  },
};