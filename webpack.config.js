const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const apiMocker = require('webpack-api-mocker');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const ParallelUglifyJsPlugin = require('webpack-parallel-uglify-plugin');
const {
  addEntries,
  addAlias,
  BasicUrl,
} = require('./webpack.utils');
const entries = require('./entry.config');

const isMock = process.env.mock;
const isDev = process.env.NODE_ENV !== 'production';

const webpackConfig = {
  mode: isDev ? 'development' : 'production',
  entry: {},
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: BasicUrl, // string 输出解析文件的目录，url 相对于 HTML 页面
  },
  module: {
    // noParse: [/react\.min\.js$/],
    rules: [
      {
        test: /.(js|jsx)$/,
        // es6编译成es5需要依赖babel-core来编译，编译的目标，需要babel-preset-env插件来设定 具体可参考： https://blog.csdn.net/qq_41831345/article/details/102477734
        use: ['babel-loader'],
        // include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        test: /.css$/,
        // css文件是引入到js文件中的，js文件不识别css，需要用css-loader读取，style-loader注入
        use: [
          { loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
            },
          },
          // 自动加前缀，使用下一代css规范，配置文件postcss.config.js
          { loader: 'postcss-loader' },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          minetype: 'application/font-woff',
          outputPath: 'assets/font',
          publicPath: BasicUrl,
        },
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          minetype: 'image/svg+xml',
          outputPath: 'assets/img',
          publicPath: BasicUrl,

        },
      },
      {
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
          outputPath: 'assets/img',
          publicPath: BasicUrl,

        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      react: isDev ? path.resolve(__dirname, './node_modules/react/cjs/react.development.js') : path.resolve(__dirname, './node_modules/react/cjs/react.production.min.js'),
    },
    modules: [path.resolve(__dirname, 'node_modules')],
  },
  plugins: [
    new CleanWebpackPlugin(), // 每次build，先清楚之前的dist文件夹
    new ServiceWorkerWebpackPlugin({
      // 插件会把入口文件列表注入sw.js文件中
      entry: path.resolve(__dirname, './sw.js'),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),

  ],

};

addEntries(webpackConfig, entries);
addAlias(webpackConfig, {
  FETCH_DATA: isMock ? path.resolve(__dirname, './mock/request.js') : path.resolve(__dirname, './src/common/request.js'),
});
if (!isDev) {
  webpackConfig.optimization = {
    minimizer: [
      // new UglifyJsPlugin(), // 压缩js文件
      new OptimizeCSSAssetsPlugin(), // 压缩css文件
    ],

  };
  // 提取css文件
  webpackConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name]-[chunkhash:8].css',
      chunkFilename: '[name]-[chunkhash:8].css',
    }),
    // 多进程压缩js文件
    new ParallelUglifyJsPlugin({
      cacheDir: '.cache/',
      uglifyJS: {
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除注释
          comments: false,
        },
        warnings: false,
        compress: {
          // 在uglifyJS时删除么有用到的代码时不输出警告
          // 删除console
          drop_console: true,
          // 内嵌已经定义但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
        },
      },
    }),

  );
}

if (isDev) {
  webpackConfig.devtool = 'source-map';
  webpackConfig.devServer = {
    before(app, server) {
      apiMocker(app, path.resolve(__dirname, './mocker/index.js'), {
        changeHost: true,
      });
    },
    contentBase: path.join(__dirname, 'dist'),
    host: '0.0.0.0',
    port: 8002,
    publicPath: '',
    disableHostCheck: true,
    // https: true,

  };
  webpackConfig.watchOptions = {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000,
  };
}
module.exports = webpackConfig;
