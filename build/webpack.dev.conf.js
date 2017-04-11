var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path');
var webpack = require('webpack');
var global  = require('glob');
// 引入基本配置
var config = require('./webpack.config');

config.vue = {
    loaders: {
        css: ExtractTextPlugin.extract("css"),
        scss: ExtractTextPlugin.extract('vue-style-loader', 'css-loader!sass-loader'),
        less: ExtractTextPlugin.extract('vue-style-loader', 'css-loader!less-loader'),
    }
}

config.output={
    // 输出路径是 myProject/output/static
    path: path.resolve(__dirname, '../output'),
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].js'
}

var getPlugins = function () {
    let plugins = new Array();
    let filePath = path.resolve(__dirname, '../src/module');
    let srcDirName = filePath+'/*/*.html';
    global.sync(srcDirName).forEach(function (name) {
        let tempName = name.slice(name.lastIndexOf('/')+1);
        let htmlName=tempName.slice(0,tempName.lastIndexOf('.html'))
        let htmlobj=new HtmlWebpackPlugin({
                      filename: tempName,
                      template: path.resolve(__dirname, name), 
                      inject: true,
                      chunks: [htmlName]
                    });
        plugins.push(htmlobj);
    });
    plugins.push(new webpack.optimize.OccurenceOrderPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NoErrorsPlugin());
    // 提取css为单文件
    plugins.push(new ExtractTextPlugin("css/[name].css"));
    plugins.push(new webpack.ProvidePlugin({$: "jquery", jQuery: "jquery"}));
    return plugins;
}


config.plugins = getPlugins();

var devClient = './build/dev-client';
Object.keys(config.entry).forEach(function (name, i) {
    var extras = [devClient]
    config.entry[name] = extras.concat(config.entry[name])
    console.log(config.entry[name])
})


module.exports = config;
