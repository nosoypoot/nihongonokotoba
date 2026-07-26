// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const boundaries = require('eslint-plugin-boundaries');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      boundaries,
    },
    ignores: ['dist/*', 'coverage/*'],
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'app/*' },
        { type: 'features', pattern: 'src/features/*' },
        { type: 'ui', pattern: 'src/ui/*' },
        { type: 'data', pattern: 'src/data/*' },
        { type: 'core', pattern: 'src/core/*' },
        { type: 'content', pattern: 'content/*' },
        { type: 'tools', pattern: 'tools/*' },
      ],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { element: { type: 'app' } },
              allow: {
                to: { element: { types: { anyOf: ['features', 'ui'] } } },
              },
            },
            {
              from: { element: { type: 'features' } },
              allow: {
                to: {
                  element: { types: { anyOf: ['features', 'data', 'core', 'ui'] } },
                },
              },
            },
            {
              from: { element: { type: 'data' } },
              allow: {
                to: {
                  element: { types: { anyOf: ['data', 'core', 'content'] } },
                },
              },
            },
            {
              from: { element: { type: 'core' } },
              allow: { to: { element: { type: 'core' } } },
            },
            {
              from: { element: { type: 'ui' } },
              allow: { to: { element: { type: 'ui' } } },
            },
            {
              from: { element: { type: 'content' } },
              allow: { to: { element: { type: 'core' } } },
            },
            {
              from: { element: { type: 'tools' } },
              allow: { to: { element: { type: 'core' } } },
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react-native', 'react-native/*', 'expo', 'expo-*'],
              message: 'src/core must remain platform independent.',
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      'app/**/*.{ts,tsx}',
      'src/core/**/*.{ts,tsx}',
      'src/features/**/*.{ts,tsx}',
      'src/ui/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'expo-sqlite',
              message: 'Only src/data may import expo-sqlite.',
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      'app/**/*.{ts,tsx}',
      'content/**/*.{ts,tsx}',
      'src/data/**/*.{ts,tsx}',
      'src/features/**/*.{ts,tsx}',
      'src/ui/**/*.{ts,tsx}',
      'tools/**/*.{ts,tsx}',
      'src/core/content-schema/**/*.{ts,tsx}',
      'src/core/session/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'ts-fsrs',
              message: 'Only src/core/scheduling may import ts-fsrs.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
    rules: {
      'boundaries/dependencies': 'off',
    },
  },
]);
