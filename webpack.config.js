'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const path = require('path');
const {manifestPlugin} = require('./src/tasks/manifest');

module.exports = {
    devServer: {
      static: {
        directory: './src'
      },
      compress: true,
      port: 9000,
    },
    mode: 'development',
    entry: './src/app.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'game.js',
      clean: true
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new CleanWebpackPlugin(),
        new CopyPlugin({
          patterns: [
            {from: "./src/assets", to: "assets"},
          ],
        }),
        manifestPlugin
    ],
    module: {
      rules: [
          {
              test: /\.js$/,
              exclude:path.resolve(__dirname, "node_modules"),
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    ['@babel/preset-env']
                  ],
                  plugins: ['@babel/plugin-proposal-class-properties']
                }
              },
          },
          {
              test: /\.(png|jpg|jpeg)$/i,
              type: 'asset/inline'
          },
          {
              test: /\.(woff|woff2|eot|ttf|otf)$/i,
              type: 'asset/resource',
          },
          {
              test: /\.css$/,
              use: ['style-loader', 'css-loader']
          }
      ]
    },
};
