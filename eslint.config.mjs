import eslint from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier/flat'; // Prettier config for flat
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const tsConfig = {
  files: ['**/*.ts'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: './tsconfig.json',
      sourceType: 'module',
    },
    globals: {
      process: 'readonly',
      console: 'readonly',
    },
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
    prettier: prettierPlugin,
  },
  rules: {
    // TypeScript semicolon rule off
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    'no-extra-semi': ['error'],
    'prettier/prettier': ['error', { semi: false }], // synced with Prettier
    quotes: ['error', 'single'],
    'prefer-const': 'error',
    'no-var': 'error',
    eqeqeq: ['error', 'always'],
    indent: ['error', 2],
    'max-len': ['warn', { code: 100 }],
  },
};

export default [
  eslint.configs.recommended,
  tsConfig,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
];
