module.exports = function (api) {
  api.cache.using(() => process.env.CLAVISPASS_DOTENV_PATH || '.env');

  const dotenvPath = process.env.CLAVISPASS_DOTENV_PATH || '.env';

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: dotenvPath,
          safe: false,
          allowUndefined: true,
        },
      ],
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-worklets/plugin',
    ],
  };
};
