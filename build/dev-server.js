// 引入必要的模块
var express = require('express')
var proxy = require("express-http-proxy")
var webpack = require('webpack')
var config = require('./webpack.dev.conf')

// 创建一个express实例
var app = express()

// 调用webpack并把配置传递过去
var compiler = webpack(config)

// 使用 webpack-dev-middleware 中间件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true,
        chunks: true
    }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        // 发布事件
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// 注册中间件
app.use(devMiddleware)
app.use(hotMiddleware)
// app.use('./static', express.static('./static'))

//Express http proxy
var apiUrl = "dev.mc.fhdream.com:7001/back";
var apiProxy = proxy(apiUrl,{
    forwardPath:function(req,res){
        return req._parsedUrl.path
}
})
app.use("/back",apiProxy);

// 监听 8080端口，开启服务器
app.listen(8080, function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://dev.mc.fhdream.com:8080')
})

