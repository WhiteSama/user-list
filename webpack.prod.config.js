const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');
const packageJson = require('./package.json');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = () => ({
    mode: 'production',
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
        library: 'UserList',
        libraryTarget: 'umd',
        globalObject: '(typeof self !== "undefined" ? self : this)',
        libraryExport: 'default',
        path: path.join(__dirname, 'dist'),
        publicPath: './',
        filename: 'index.js',
    },
    plugins: [
        new CleanWebpackPlugin(),
        //new uglifyJsPlugin(),
        new HtmlWebpackPlugin({
            title: packageJson.title,
            template: './src/index.html',
        }),
        new webpack.NormalModuleReplacementPlugin(/type-graphql$/, resource => {
            resource.request = resource.request.replace(/type-graphql/, "type-graphql/dist/browser-shim");
        }),
    ]
});
