module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    API_BASE_URL: '"https://your-domain.com/api"'
  },
  mini: {},
  h5: {
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    // webpackChain (chain, webpack) {}
    /**
     * Webpack 相关配置
     * @docs https://webpack.js.org/configuration/
     */
    // webpack: {}
  }
}