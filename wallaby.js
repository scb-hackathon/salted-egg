module.exports = wallaby => ({
  files: [
    'src/**/*.js',
    'src/**/*.ts',
    'test/utils/*',
    'test/mocks/*',
    'tsconfig.json',
    '__mocks__/**/*',
    '@types/**/*',
  ],

  tests: ['test/**/*.js', 'test/**/*.ts', '!test/utils/*', '!test/mocks/*'],

  env: {
    type: 'node',
    runner: 'node',
  },

  testFramework: 'jest',

  compilers: {
    '**/*.ts?(x)': wallaby.compilers.typeScript({module: 'commonjs'}),
  },
})
