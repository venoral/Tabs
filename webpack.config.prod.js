var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var cssnano = require('cssnano');

module.exports = {
	devtool: 'source-map',
	entry: {
		app: ['./src/app.js'],
		vendors: ['jquery']
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].js'
	},
	module: {
		loaders: [{
			test: /\.js?$/,
			include: [path.resolve(__dirname, 'src')],
			loaders: ['babel']
		}, {
			test: /\.scss$/,
			include: [path.resolve(__dirname, 'src')],
			loader: ExtractTextPlugin.extract('style-loader', 'css!postcss!sass')
		}]
	},
	postcss: [
		cssnano({
			sourcemap: true,
			autoprefixer: {
				add: true,
				remove: true,
				browsers: ['last 2 version', 'Chrome 31', 'Safari 8']
			},
			discardComments: {
				removeAll: true
			}
		})
	],
	resolve: {
		extensions: ['', '.js', '.scss', '.css']
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
		new webpack.optimize.DedupePlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			__DEV__: false
		}),
		new ExtractTextPlugin('style.css', {
			allChunks: true
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				dead_code: true
			}
		})
	]
};