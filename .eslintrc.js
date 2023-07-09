module.exports = {
  root: true,
  parserOptions: {
    // we have different babel configs for different parts of the app
    requireConfigFile: false,
  },
  extends: '@react-native',
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  ignorePatterns: ['node_modules/', 'ios/', 'android/', 'dist/', 'build/'],
  overrides: [
    // override "simple-import-sort" config
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Packages `react` related packages come first.
              ['^react', '^@?\\w'],
              // Internal packages.
              // Workspace packages.
              ['^(@saku)(/.*|$)'],
              [
                '^@(utils|store|api|constants|screens|navigation|icons|atoms|molecules|types|hooks|svg)(/.*|$)',
              ],
              // Side effect imports.
              ['^\\u0000'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ],
          },
        ],
      },
    },
  ],
};
