var path = require('path');
var autoprefixer = require('autoprefixer');
var global  = require('glob');

var getEntrys = function () {
    let entrys = {};
    let folderPath=path.resolve(__dirname, '../src/module');
    let srcDirName = folderPath+'/*/app.js';
    // let srcDirName = folderPath+'/shop/app.js';
    global.sync(srcDirName).forEach(function (name) {
        let tempPath = name.slice(0, name.lastIndexOf('/'));
        let entryName=tempPath.slice(tempPath.lastIndexOf('/')+1)
        entrys[entryName] = name;
        
    });
    return entrys;
}

module.exports = {
    // 入口文件，path.resolve()方法，可以结合我们给定的两个参数最后生成绝对路径，最终指向的就是我们的index.js文件
    entry:getEntrys(),

    resolve: {
        extensions: ['', '.js', '.vue'],
        alias: {
            // 'src': path.resolve(__dirname, '../src'),
            'jquery': 'jquery',
            'bootstrap-loader': 'bootstrap-loader',
        }
    },
    module: {
        
        loaders: [
            // 使用vue-loader 加载 .vue 结尾的文件
            {
                test: /\.vue$/, 
                loader: 'vue'   
            },
            {
                test: /\.js$/,
                loader: 'babel?presets=es2015&compact=false',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(scss|sass)$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.less$/,
                loader: 'style!css!less'
            },
            {
                test: /\.(eot|woff|svg|ttf|woff2)(\?|$)/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name:'images/[name].[ext]?[hash:7]'
                }
            }
        ]
    },
    vue:{
        loaders:{
            js:'babel'
        }
    },
    babel:{
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
}
