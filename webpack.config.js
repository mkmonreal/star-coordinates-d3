const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabelLoader = require('babel-loader');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
    },
    devServer: {
        compress: true,
        port: 3000,
    },
    module: {
        rules:[{
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['babel-loader']
        }]
    },
    plugins: [new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'index.html'),
    })],
};
