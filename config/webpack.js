const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
const browserlistConfig = require('./browserlist');
const dev = process.argv.includes('--dev');
const stats = process.argv.includes('--stats');

let config = {
    output: {
        filename: '[name].js'
    },
    devtool: 'source-map',
    mode: 'development',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            targets: {
                                ie: 11,
                                browsers: 'last 2 versions'
                            },
                            useBuiltIns: 'usage',
                            modules: false,
                            debug: true
                        }]
                    ],
                    ignore: ['node_modules']
                }
            }]
        }]
    }
};

if (!dev) {
    config = merge(config, {
        devtool: false,
        mode: 'production'
    });
}

if (stats) {
    config = merge(config, {
        plugins: [
            new webpackBundleAnalyzer.BundleAnalyzerPlugin({
                analyzerMode: 'static'
            })
        ]
    });
}

module.exports = config;
