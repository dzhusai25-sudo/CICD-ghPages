const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/weather/script.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 9013,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/weather/index.html',
      filename: 'index.html',
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
