module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
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
          '@store': './src/store',
          '@api': './src/api',
          '@constants': './src/constants',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@icons': './src/assets/icons',
          '@atoms': './src/components/atoms',
          '@molecules': './src/components/molecules',
          '@types': './src/types',
          '@hooks': './src/hooks',
          '@svg': './src/assets/svg',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
