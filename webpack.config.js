let path = require('path'),
  glob = require('glob'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin')

let DIST_DIR = path.join(__dirname, 'dist'),
  CLIENT_DIR = path.join(__dirname, 'src')

const isDevelopment = process.env.NODE_ENV !== 'production'

const publicPath = isDevelopment ? '/' : ''

module.exports = {
  context: CLIENT_DIR,

  entry: ['./index'],

  output: {
    path: DIST_DIR,
    publicPath,
    filename: 'romajs_[hash].js'
  },

  plugins: [
    new webpack.EnvironmentPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
      filename: 'index.html',
      favicon: '../assets/favicon.ico',
    }),
  ],

  module: {

    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]'
              }
            }
          }
        ]
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
              modules: {
                localIdentName: '[local]'
              }
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
        test: /\.(png|jpg|ttf|eot)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {limit: 10000}
          }
        ]
      }
    ]
  },

  resolve: {
    modules: ['node_modules', 'vendor'],
    extensions: ['.js', '.json', '.css']
  }

}
