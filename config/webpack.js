const webpack = require('webpack'),
    merge = require('webpack-merge'),
    browserlistConfig = require('./browserlist');

let config = {
    output: {
        filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['env', {
                            targets: {
                                ie: 11,
                                browsers: 'last 2 versions'
                            },
                            useBuiltIns: 'usage',
                            modules: false
                        }]
                    ]
                }
            }]
        }]
    }
};

if (!process.argv.includes('--dev')) {
    config = merge(config, {
        devtool: false,
        plugins: [
            new webpack.optimize.UglifyJsPlugin()
        ]
    });
}

module.exports = config;
