import importPlugin from 'eslint-plugin-import';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist/**', 'src/@types/**'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-default-export': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/types/**', '**/types'],
              message: 'Use dtos/incoming, dtos/outgoing, or dtos/internal instead of types/.',
            },
          ],
        },
      ],
    },
  },
];
