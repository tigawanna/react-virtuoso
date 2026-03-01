import pluginJs from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  pluginJs.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  perfectionist.configs['recommended-natural'],
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-modules': 'off',
      'perfectionist/sort-named-imports': 'off',
    },
  },
  {
    ignores: ['node_modules/', 'dist/', 'src/**/__mocks__/', 'test-results'],
  }
)
