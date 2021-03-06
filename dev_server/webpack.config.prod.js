var path = require('path');
var webpack = require('webpack');

module.exports = {
  // devtool: 'hidden-source-map',
  entry: [
    path.resolve(__dirname, '../client/src/client.js')
  ],
  output: {
    path: path.resolve(__dirname, '../client/dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.ProvidePlugin({ // http://mts.io/2015/04/08/webpack-shims-polyfills/
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      comments: false
    })
  ],
  module: {
    loaders: [{
      test: /\.jsx?/,
      loader: 'babel',
      // include: path.resolve(__dirname, '../../'),
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'stage-2', 'react']
      }
    }]
  }
};
