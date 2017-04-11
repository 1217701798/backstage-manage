var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var path = require('path');
var webpack = require('webpack');
var global  = require('glob');
// 引入基本配置
var config = require('./webpack.config');
var urlPath = "/front";

config.output={
    // 输出路径是 myProject/output/static
    path: path.resolve(__dirname, '..'+ urlPath),
    publicPath: urlPath+"/",
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].js'
}

config.vue = {
    loaders: {
        css: ExtractTextPlugin.extract("css"),
        scss: ExtractTextPlugin.extract('vue-style-loader', 'css-loader!sass-loader'),
        less: ExtractTextPlugin.extract('vue-style-loader', 'css-loader!less-loader'),
    }
};

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

    plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    }));
    // 压缩代码
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
    plugins.push(new webpack.optimize.OccurenceOrderPlugin());
    // 提取css为单文件
    plugins.push(new ExtractTextPlugin("css/[name].css"));
    plugins.push(new webpack.ProvidePlugin({$: "jquery", jQuery: "jquery"}));
    return plugins;
}


config.plugins = getPlugins();

module.exports = config;
