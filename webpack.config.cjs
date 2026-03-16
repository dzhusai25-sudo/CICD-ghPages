const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const REPO_NAME = 'CICD-ghPages';
const BASE_URL = `https://dzhusai25-sudo.github.io/${REPO_NAME}/`;
const PREFIX = isProduction ? BASE_URL : '/';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 8015,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      publicPath: PREFIX,
    }),
    new HtmlWebpackPlugin({
      filename: '404.html',
      publicPath: PREFIX,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
