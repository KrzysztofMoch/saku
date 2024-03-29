module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@utils': './src/utils',
          // '@store': './src/store',
          '@api': './src/api',
          '@constants': './src/constants',
          // '@screens': './src/screens',
          // '@navigation': './src/navigation',
          // '@icons': './src/assets/icons',
          // '@atoms': './src/components/atoms',
          // '@molecules': './src/components/molecules',
          '@types': './src/types',
          '@hooks': './src/hooks',
          // '@svg': './src/assets/svg',
        },
      },
    ],
  ],
};
