module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    API_BASE_URL: '"http://127.0.0.1:8081/api"'
  },
  mini: {},
  h5: {
    devServer: {
      port: 10086,
      host: '127.0.0.1'
    }
  }
}