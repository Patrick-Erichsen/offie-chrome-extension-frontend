const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env) => ({
    entry: {
        content: path.join(__dirname, './src/content/index.tsx'),
        background: path.join(__dirname, './src/background/index.ts'),
    },
    output: {
        path: path.join(
            __dirname,
            `${env.production ? 'prod-build' : 'dev-build'}`
        ),
        filename: '[name].js',
    },
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.(png|woff|woff2|eot|ttf|otf|svg)$/,
                loader: 'url-loader',
            },
            {
                test: /\.(css|scss)$/,
                use: ['style-loader', 'css-loader'],
                exclude: /\.module\.css$/,
            },
            {
                test: /\.ts(x)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                use: 'file-loader',
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            mimetype: 'image/png',
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
    },
    devServer: {
        contentBase: './dist',
    },
    plugins: [
        new Dotenv({
            path: `.env.${env.production ? 'production' : 'development'}`,
        }),
        new CopyPlugin({
            patterns: [{ from: 'assets', to: '.' }],
        }),
    ],
});
