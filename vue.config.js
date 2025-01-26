const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pwa: {
    iconPaths: {
      favicon32: 'logo.png',
      favicon16: 'logo.png',
      appleTouchIcon: 'logo.png',
      maskIcon: 'logo.png',
      msTileImage: 'logo.png'
    }
  },
  chainWebpack: config => {
    config
    .plugin('html')
    .tap(args => {
    args[0].title = '你好，2025';
    return args;
    });
    },
  transpileDependencies: true,
  publicPath: './',
  devServer: {
    open:false,
    host: '0.0.0.0',
    port: 8081,
    proxy: {
      '/devApi': {
        target: 'http://localhost:8080/api',
        changeOrigin: true,
        ws: false,

        pathRewrite: {
          '^/devApi': ''
        }
      }
    }
  }
})
