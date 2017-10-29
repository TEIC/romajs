const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const autoprefixer = require('autoprefixer');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const jsSourcePath = path.join(__dirname, '.');
const buildPath = path.join(__dirname, './build');
const imgPath = path.join(__dirname, './source/assets/img');
const sourcePath = path.join(__dirname, '.');

// Common plugins
const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor-[hash].js',
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv),
    },
  }),
  new webpack.NamedModulesPlugin(),
  new HtmlWebpackPlugin({
    template: path.join(sourcePath, 'index.html'),
    path: buildPath,
    filename: 'index.html',
  }),
  new webpack.LoaderOptionsPlugin ({
    options: {
      // postcss: [
      //   autoprefixer({
      //     browsers: [
      //       'last 3 version',
      //       'ie >= 10',
      //     ],
      //   }),
      // ],
      context: sourcePath,
    },
  }),
];

// Common rules
const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
      'babel-loader', 'eslint-loader'
    ],
  },{
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  },
  {
    test: /\.scss$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          modules: true,
          localIdentName: '[local]'
        }
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: true,
          sourceMapContents: true,
          includePaths: glob.sync('node_modules').map((d) => path.join(__dirname, d)),
        }
      }
    ]
  },
  {
    test:  /\.(png|jpg|ttf|eot|gif)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'url-loader',
        options: {limit: 10000}
      }
    ]
  }
];

if (isProduction) {
  // Production plugins
  plugins.push(
    // new webpack.LoaderOptionsPlugin({
    //   minimize: true,
    //   debug: false,
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     screw_ie8: true,
    //     conditionals: true,
    //     unused: true,
    //     comparisons: true,
    //     sequences: true,
    //     dead_code: true,
    //     evaluate: true,
    //     if_return: true,
    //     join_vars: true,
    //   },
    //   output: {
    //     comments: false,
    //   },
    // }),
    new ExtractTextPlugin('style-[hash].css')
  );

  // Production rules
  // rules.push(
  //   {
  //     test: /\.scss$/,
  //     use: [
  //       {
  //         loader: 'style-loader'
  //       },
  //       {
  //         loader: 'css-loader',
  //         options: {
  //           importLoaders: 2,
  //           modules: true,
  //           localIdentName: '[name]__[local]'
  //         }
  //       },
  //       {
  //         loader: 'sass-loader',
  //         options: {
  //           outputStyle: 'expanded',
  //           sourceMap: true,
  //           sourceMapContents: true
  //         }
  //       }
  //     ]
  //   },
  // );
} else {
  // Development plugins
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );

  // Development rules
  // rules.push(
  //   {
  //     test: /\.scss$/,
  //     use: [
  //       {
  //         loader: 'style-loader'
  //       },
  //       {
  //         loader: 'css-loader',
  //         options: {
  //           importLoaders: 2,
  //           modules: true,
  //           localIdentName: '[name]__[local]'
  //         }
  //       },
  //       {
  //         loader: 'sass-loader',
  //         options: {
  //           outputStyle: 'expanded',
  //           sourceMap: true,
  //           sourceMapContents: true
  //         }
  //       }
  //     ]
  //   }
  // );
}

module.exports = {
  devtool: isProduction ? 'eval' : 'source-map',
  context: jsSourcePath,
  entry: {
    js: './src/index.js',
    vendor: [
      'babel-polyfill',
      'es6-promise',
      'immutable',
      'isomorphic-fetch',
      'react-dom',
      'react-redux',
      'react-router',
      'react',
      'redux-thunk',
      'redux',
    ],
  },
  output: {
    path: buildPath,
    publicPath: '/',
    filename: 'app-[hash].js',
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx', '.scss', '.css'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      jsSourcePath,
    ],
  },
  plugins,
  devServer: {
    contentBase: isProduction ? './build' : '.',
    historyApiFallback: true,
    port: 3000,
    compress: isProduction,
    inline: !isProduction,
    hot: !isProduction,
    host: '0.0.0.0',
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m',
      },
    },
  },
};
