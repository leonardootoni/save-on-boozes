module.exports = {
  //files: [ './**/*.{js,ts,mjs,mts,json}' ],
  env: {
    commonjs: false,
    node: true,
  },
  settings: {
     'import/resolver': {
      typescript: {},
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:json/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [ '@typescript-eslint', 'import', 'jest', 'json' ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [ './tsconfig.json' ],
  },
  root: true,
  rules: {
    'json/*': [ 'error', { allowComments: true } ],
    'max-len': [ 'warn', {
      code: 256, ignoreTrailingComments: true,
    } ],
    'arrow-parens': [ 'error', 'as-needed' ],
    'newline-per-chained-call': [ 'error', { ignoreChainWithDepth: 6 } ], // Help keeping most of Joi validations in 1ln
    'space-in-parens': [ 'error', 'always' ],
    'array-bracket-spacing': [ 'error', 'always' ],
    'object-curly-spacing': [ 'error', 'always',
      {
        arraysInObjects: true,
        objectsInObjects: true,
      },
    ],
    'object-curly-newline': [ 'error', { consistent: true } ],
    "key-spacing":     [ "error", { align: "value" } ],
    'no-multi-spaces': [ 'error',
      { ignoreEOLComments: true, exceptions: { VariableDeclarator: true, AssignmentExpression: true, ObjectExpression: true } },
    ],
    'no-underscore-dangle': 'off',
    'no-multiple-empty-lines': [ 'error', { max: 2 } ],

  },
};
