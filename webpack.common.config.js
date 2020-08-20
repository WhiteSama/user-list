const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.js', '.css', '.scss', '.json', '.png'],
        modules: [path.resolve('/'), 'node_modules'],
        alias: {
            '@root': path.resolve(__dirname, 'src'),
            '@module': path.resolve(__dirname, 'src/module'),
            '@styles': path.resolve(__dirname, 'src/styles'),
            '@delivery': path.resolve(__dirname, 'src/delivery'),
            '@helpers': path.resolve(__dirname, 'src/helpers'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@views': path.resolve(__dirname, 'src/views'),
            '@store': path.resolve(__dirname, 'src/store')
        },
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        babelrc: false,
                        presets: [
                            [
                                '@babel/preset-env',
                                { targets: { browsers: 'last 2 versions' } },
                            ]
                        ],
                        plugins: [
                            ['@babel/plugin-proposal-decorators', { legacy: true }],
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                        ],
                    },
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 2,
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|ico|gif|svg|ttf|eot|woff(2)?)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
};
