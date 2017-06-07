const path = require('path');
const webpack = require("webpack");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const precss = require('precss');
const mqpacker = require('css-mqpacker');

// const mainCSS = new ExtractTextPlugin('./artifact/app.css');

module.exports = [
	{
		context: __dirname,
		entry: './debug/ts/entry.tsx',
		output: {
			filename: './artifact/app.js'
		},
		resolve: {
			extensions: ['.scss' , '.css' , ".ts" , ".tsx" , '.js' , '.json'],
		},
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /(\.scss|\.css)$/,
					use: [
					// use: mainCSS.extract([
						{
							loader: 'style-loader',
							options: { sourceMap: true }
						}, {
							loader: 'css-loader',
							options: {
								localIdentName: '[sha512:hash:base32]-[name]-[local]',
								modules: true,
								sourceMap: true
							}
						}, {
							loader: 'postcss-loader',
							options: {
								postcss: [
									precss(),
									autoprefixer({
										browsers: [
											'last 3 version',
											'ie >= 10',
										],
									}),
									mqpacker(),
								],
								sourceMap: true
							},
							// options: { sourceMap: true }
						}, {
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					]
					// ])
				},

				// Image
				{
					test: /\.(png|jpg|jpeg|gif|bmp)$/, loader: 'url-loader?limit=8192'
				},

				// TypeScript
				{
					test: /\.tsx?$/,
					loader: "ts-loader",
					exclude: /(node_modules)/
					// loader: "awesome-typescript-loader"
				},

				// Html
				{
					test: /\.hbs$/,
					loader: "handlebars-loader"
				},
				{
					enforce: "pre",
					test: /\.js$/,
					loader: "source-map-loader"
				},
			],
		},

		// postcss: [autoprefixer],
		plugins: [
			// mainCSS,
			new HtmlWebpackPlugin({
				title: 'drawChat',
				template: 'debug/entry.hbs',
				filename: './artifact/index.html',
				xhtml: true,
				hash: true,
				cache: true,
				cacheBreak: new Date().getTime()
			})
		],
		externals: {
			"react": "React",
			"react-dom": "ReactDOM"
		}
	},
];
