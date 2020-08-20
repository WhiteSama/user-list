const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const packageJson = require('./package.json');


module.exports = () => ({
    mode: 'development',
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        "@babel/polyfill",

        path.join(__dirname, 'src/index.js'),
    ],
    output: {
        library: 'UserList',
        libraryTarget: 'umd',
        libraryExport: 'default',
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js'
    },
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        historyApiFallback: true,
        noInfo: false,
        headers: {
            "Access-Controll-Allow-Origin": "*",
            "Access-Controll-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS"
        },
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: packageJson.title,
            template: './src/index.html',
            inject: 'head'
        }),
        new webpack.NormalModuleReplacementPlugin(/type-graphql$/, resource => {
            resource.request = resource.request.replace(/type-graphql/, "type-graphql/dist/browser-shim");
        }),
    ]
});
