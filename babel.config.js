module.exports = function (api) {
  api.cache(true);
  
  const isProd = process.env.NODE_ENV === 'production';

  const plugins = [];
  
  if (isProd) {
    plugins.push(require.resolve('babel-plugin-transform-remove-console'));
  }

  // Reanimated plugin must be the absolute last plugin in the array!
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: ["babel-preset-expo"],
    plugins,
  };
};
