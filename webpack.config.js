const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.common.config.js');

module.exports = (nodeSettings) => {
  const config = !!nodeSettings && require(`./webpack.${nodeSettings.build}.config.js`);
  return webpackMerge(commonConfig, config());
};
