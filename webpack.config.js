var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
	template: __dirname + '/app/index.html',
	filename: 'index.html',
	inject: 'body'
});

module.exports = {
	entry: __dirname + '/app/index.js',
	output: {
		filename: 'transformed.js',
		path: __dirname + '/build'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test : /\.js$/,
				exclude : /node_modules/,
				loader : 'babel-loader'
			},
			{ test: /\.(png|jpg)$/, loader: 'file-loader' }
		]
	},
	plugins: [HTMLWebpackPluginConfig]
};