const path = require("path");

module.exports = {
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
    config.module
      .rule('graphql')
      .test(/\.(graphql|gql)$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end();
  },  
  configureWebpack: () => {
    return {
      resolve: {
        alias: {
          "@": path.resolve("src"),
          //leaflet: path.resolve("node_modules/leaflet"),
          //"vue2-leaflet": path.resolve("node_modules/vue2-leaflet")
          //"vue2-leaflet": path.resolve("dist/vue2-leaflet.es.js")
        }
      }
    };
  },

  publicPath: '',
  // outputDir: '../docs/examples',
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined
};
