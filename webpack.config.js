const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')
const ENV = process.env.NODE_ENV || 'development'
const ISDEV = ENV !== 'production'

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.js',
  mode: ENV,
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: ISDEV ? '[name].js' : '[name].[chunkhash].js'
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json'],
    modules: [
      path.resolve(__dirname, 'src/lib'),
      path.resolve(__dirname, 'node_modules'),
      'node_modules'
    ],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
      'proptypes': 'proptypes/disabled'
    }
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: path.resolve(__dirname, 'src'),
      enforce: 'pre',
      use: 'source-map-loader'
    },
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          'presets': [
            ['@babel/preset-stage-0', {
              'decoratorsLegacy': true
            }]
          ],
          'plugins': [
            ['@babel/plugin-transform-react-jsx', {
              'pragma': 'h'
            }],
            'transform-class-properties',
            ...(() => ISDEV ? [] : [
              'transform-react-remove-prop-types'
            ])()
          ],
          cacheDirectory: true
        }
      }]
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            modules: true,
            sourceMap: true,
            importLoaders: 1,
            ...(() => ISDEV ? {} : {
              localIdentName: '[emoji:3]',
              minimize: true
            })()
          }
        },
        {
          loader: `postcss-loader`,
          options: {
            sourceMap: true,
            plugins: () => [
              require('postcss-import')({
                path: path.join(__dirname, 'src', 'components'),
                addDependencyTo: webpack
              }),
              require('postcss-cssnext')(),
              require('postcss-unprefix')()
            ]
          }
        }
        ]
      })
    },
    {
      test: /\.json$/,
      use: 'json-loader'
    },
    {
      test: /\.md$/,
      use: [{
        loader: 'html-loader'
      },
      {
        loader: 'markdown-loader',
        options: {
          // marked options here
        }
      }
      ]
    },
    {
      test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
      use: ISDEV ? 'url-loader' : 'file-loader'
    }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test (chunks) {
            const nodeModules = /node_modules/
            const css = /\.css$/
            return !css.test(chunks.resource) && nodeModules.test(chunks.resource)
          },
          name: 'vendor',
          chunks: 'initial',
          enforce: true
        },
        main: {
          name: 'main',
          chunks: 'all'
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    }),
    new ExtractTextPlugin({
      filename: 'style.[chunkhash].css',
      allChunks: true,
      disable: ENV !== 'production'
    }),
    new HtmlWebpackPlugin({
      template: './index.ejs',
      minify: {
        collapseWhitespace: true
      },
      inject: false
    }),
    new CopyWebpackPlugin([{
      from: './manifest.json',
      to: './'
    },
    {
      from: './favicon.ico',
      to: './'
    },
    {
      from: './assets',
      to: './assets'
    }
    ]),
    ...(() => !ISDEV ? [
      new OfflinePlugin({
        relativePaths: false,
        AppCache: false,
        excludes: ['**/*.map'],
        ServiceWorker: {
          events: true
        },
        cacheMaps: [{
          match: /.*/,
          to: '/',
          requestTypes: ['navigate']
        }],
        publicPath: '/'
      })
    ] : [])()
  ],

  stats: {
    colors: true
  },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  devtool: ISDEV ? 'cheap-module-eval-source-map' : false, // 'source-map',

  devServer: {
    port: process.env.PORT || 8080,
    host: 'localhost',
    publicPath: '/',
    contentBase: './src',
    historyApiFallback: true,
    open: true
  }
}
