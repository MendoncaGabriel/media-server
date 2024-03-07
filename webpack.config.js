const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './app.js', // Substitua pelo caminho do seu arquivo principal
  target: 'node',
  externals: [require('webpack-node-externals')()],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
      },
    ],
  },
};
