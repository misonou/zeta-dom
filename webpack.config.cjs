const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const outputPath = path.join(process.cwd(), 'dist');
const packagePath = path.join(process.cwd(), 'build');

module.exports = {
    entry: {
        'zeta': './src/index.js',
        'zeta.min': './src/index.js',
    },
    devtool: 'source-map',
    output: {
        path: outputPath,
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
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [`${packagePath}/**/*`]
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src',
                    to: `${packagePath}`
                },
                {
                    from: 'dist',
                    to: `${packagePath}/dist`
                },
                {
                    from: 'README.md',
                    to: `${packagePath}`,
                },
                {
                    from: 'package.json',
                    to: `${packagePath}`,
                    transform: function (content) {
                        var packageJSON = JSON.parse(content);
                        packageJSON.main = 'index.js';
                        packageJSON.types = 'index.d.ts';
                        return JSON.stringify(packageJSON, null, 2);
                    }
                }
            ]
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.min\.js$/i
            })
        ]
    },
    externals: {
        'promise-polyfill': 'promise-polyfill',
        'jquery': 'jQuery'
    }
};
