var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

var ROOT_PATH = path.resolve(__dirname);
var STATIC_PATH = path.resolve(ROOT_PATH, 'static');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: {
		app: [
			'./src/app.js',
		],
		vendors: ['jquery']
	},
	output: {
		path: STATIC_PATH,
		filename: '[name].js',
		publicPath: '/static/'
	},
	devServer: {
		historyApiFallback: true,
		hot: true,
		inline: true,
		progress: true
	},
	module: {
		loaders: [{
			test: /\.js?$/,
			include: [
				path.resolve(__dirname, 'src')
			],
			loaders: ['babel']
		}, {
			test: /\.scss$/,
			include: [
				path.resolve(__dirname, 'src')
			],
			loader: 'style!css!sass?sourceMap=true&true&sourceMapContents=true'
		}]
	},
	resolve: {
		extensions: ['', '.js', '.scss', '.css']
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
		new webpack.optimize.DedupePlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			__DEV__: true
		}),
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin()
	]
};