import globals from 'globals'
import pluginJs from '@eslint/js'




/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['dist'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs'
    }
  },
  {
    languageOptions: {
      globals: globals.node
    }
  },

  {
    ...pluginJs.configs.recommended,


    rules: {
      'indent': [
        'error',
        2
      ],
      'linebreak-style': [
        'error',
        'unix'
      ],
      'quotes': [
        'error',
        'single'
      ],
      'semi': [
        'error',
        'never'
      ],
      'eqeqeq': [
        'error',
      ],
      'no-trailing-spaces': [
        'error',
      ],
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
      'no-console': 0
    },
  }
]