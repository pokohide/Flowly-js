const webpack = require('webpack')

module.exports = [{
  entry: {
    'flowly_text': './src/index.js',
    'flowly_text.min': './src/index.js'
  },
  devtool: 'source-map',
  output: {
   path: __dirname + '/dist/',
   filename: '[name].js'
  },
  module: {
   rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
   extensions: ['.js']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ include: /\.min\.js$/, minimize: true })
  ]
}]
