

module.exports = {
  mode: 'production',

  entry: './src/app.js',
  output: {
    filename: "app.js",
    path: `${__dirname}/dist`
  },

  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: [
      //     'vue-style-loader',
      //     'css-loader'
      //   ]
      // },
      {
        test: /\.css/,
        use: [
          'style-loader',
          {loader: 'css-loader', options: {url: false}},
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // Babel のオプションを指定する
        options: {
          presets: [
            // env を指定することで、ES2017 を ES5 に変換。
            // {modules: false}にしないと import 文が Babel によって CommonJS に変換され、
            // webpack の Tree Shaking 機能が使えない
            ['env', {'modules': false}]
          ]
        },
        exclude: /node_modules/
      }
    ]
  },
  // import 文で .ts ファイルを解決するため
  resolve: {
    // Webpackで利用するときの設定
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
}