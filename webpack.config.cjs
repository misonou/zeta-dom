const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

module.exports = {
    entry: {
        'zeta': './src/index.js',
        'zeta.min': './src/index.js',
    },
    devtool: 'source-map',
    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: '[name].js',
        library: 'zeta',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: `${packageJSON.name} v${packageJSON.version} | (c) ${packageJSON.author} | ${packageJSON.homepage}`
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.min\.js$/i,
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: 'some'
                    }
                }
            })
        ]
    },
    externals: {
        'promise-polyfill': 'promise-polyfill',
        'jquery': 'jQuery'
    }
};
