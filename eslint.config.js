import js from '@eslint/js';
import functional from 'eslint-plugin-functional';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['build/**', 'dist/**', '.svelte-kit/**', 'node_modules/**', 'coverage/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    plugins: {
      functional
    }
  },
  {
    files: ['src/**/*.{ts,svelte}'],
    rules: {
      'functional/immutable-data': 'error',
      'functional/no-let': 'error',
      'functional/no-loop-statements': 'error',
      'functional/no-this-expressions': 'error',
      'functional/prefer-readonly-type': 'error',
      'functional/prefer-tacit': 'off'
    }
  },
  {
    files: ['src/**/*.svelte'],
    rules: {
      'functional/immutable-data': 'off',
      'functional/no-let': 'off'
    }
  },
  {
    files: ['scripts/**/*.ts'],
    rules: {
      'functional/immutable-data': 'off',
      'functional/no-let': 'off',
      'functional/prefer-readonly-type': 'off'
    }
  }
);
