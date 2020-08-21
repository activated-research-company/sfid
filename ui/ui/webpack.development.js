const { merge } = require('webpack-merge'); // eslint-disable-line
const dotenv = require('dotenv'); // eslint-disable-line
const path = require('path');
const { DefinePlugin } = require('webpack'); // eslint-disable-line
const common = require('./webpack.common.js');

const config = {
  ...dotenv.config({ path: path.join(process.cwd(), '..', '..', '.env') }).parsed,
  ...dotenv.config().parsed,
};

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new DefinePlugin({
      'process.env': JSON.stringify(config),
    }),
  ],
  devServer: {
    contentBase: './dist',
  },
});
