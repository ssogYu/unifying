const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const resolvePath = (pathName) => {
  return path.resolve(__dirname, pathName);
};
const syleLoaders = (loader) => {
  const loaderArr = [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env'],
        },
      },
    },
  ];
  if (loader) {
    loaderArr.push(loader);
  }
  return loaderArr;
};

module.exports = {
  entry: resolvePath('./index.tsx'),
  output: {
    path: resolvePath('./dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(tsx?|jsx?)$/i,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          },
          {
            test: /\.css$/i,
            use: syleLoaders(),
          },
          {
            test: /\.less$/i,
            use: syleLoaders('less-loader'),
          },
          {
            test: /\.s[ac]ss$/i,
            use: syleLoaders('sass-loader'),
          },
          {
            test: /.(png|jpg|jpeg|gif|svg|webp)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024,
              },
            },
            generator: {
              filename: 'static/images/[name].[contenthash:8][ext]',
            },
          },
          {
            test: /.(woff2?|eot|ttf|otf)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024,
              },
            },
            generator: {
              filename: 'static/fonts/[name].[contenthash:8][ext]',
            },
          },
          {
            test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024,
              },
            },
            generator: {
              filename: 'static/media/[name].[contenthash:8][ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts', '.jsx'],
    alias: {
      '@': path.join(__dirname, './src'),
    },
    // modules: [path.resolve(__dirname, './node_modules')],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolvePath('./index.html'),
      inject: true,
    }),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
  ],
  devServer: {
    port: 3000,
    compress: false,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, './public'),
    },
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: false,
    },
  },
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
};
