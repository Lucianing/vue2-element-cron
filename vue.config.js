const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  css: {
    extract: false
  },
  pages: {
    index: {
      entry: 'demo/main.ts',
      template: 'public/index.html',
      filename: 'index.html'
    }
  }
})
