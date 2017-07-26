const webpack = require('webpack'),
    browserlistConfig = require('./browserlist');

let config = {
    output: {
        filename: 'bundle.js'
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
                        [
                            'env',
                            {
                                targets: browserlistConfig,
                                modules: false
                            }
                        ]
                    ]
                }
            }]
        }]
    },
    resolve: {
        extensions: ['.js']
    }
};

if (!process.argv.includes('--dev')) {
    Object.assign(config, {
        devtool: false,
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                mangle: {
                    keep_fnames: true
                },
                output: {
                    comments: false
                }
            }),

            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            })
        ]
    });
}

module.exports = config;
