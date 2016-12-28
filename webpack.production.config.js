/**
 * User: siguang
 * Date: 2016/12/28
 * Time: 15:04
 */
let webpack = require('webpack');
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
// let ExtractTextPlugin = require("extract-text-webpack-plugin"); // 单独打包CSS

/*  文件路径配置 */
let basePath = __dirname;
let appPath = path.resolve(basePath, 'src');
let buildPath = path.resolve(basePath, 'build');

/* libs 目录下的库文件 */
let libsPath = path.resolve(basePath, 'src/libs');
// let jquery = path.resolve(libsPath, 'jquery')

// webpack配置对象
module.exports = {

    // 入口文件
    entry: {
        app: path.resolve(appPath, 'js/index.js'),
        list: path.resolve(appPath, 'js/list.js'),

        /* 
        * vendor 可以将所有业务中require()引用的库或框架不与业务代码混到一起, 
        * 将其打包到vendor.js文件内，在页面中单独加载
        * 通过plugins中引用插件来处理 new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js?[hash]'),
        */
        vendor: ['jquery']      // 这里调的是node_module下的，如果使用libs目录可以在配置
    },

    // 出口文件
    output: {
        path: buildPath,
        filename: '/js/[name].min.js?[hash]',
        chunkFilename: "[name].min.js?[hash]"
    },

    //加载器配置
    module: {
        loaders: [

            // 处理require()引入的css文件，并将代码显示到页面的<style>中
            { test: /\.css$/, loader: "style-loader!css-loader" },

            // 将jsx文件转成js文件
            { test: /\.js$/, loader: 'jsx-loader?harmony'},

            // 将scss文件转成css文件
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},

            // ?limit=8192  limit设置小于8k的图片转成64位编码，大小8于不会被转码
            { test: /\.(png|jpg|woff|eot|ttf|svg|gif)$/, loader: 'url-loader?limit=8192'},

            // ES6 转 ES5
            {    
                test: /\.js?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }   
        ]
    },

    plugins: [

        // 压缩打包的文件
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         //supresses warnings, usually from module minification
        //         warnings: false
        //     }
        // }),

        // 将vendor中的库合并到一起
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js?[hash]'),    

        // html
        new HtmlWebpackPlugin({
            // 改变页面的<title>标签的内容 
            title: 'Hello World app',                   // 页面调用<%= htmlWebpackPlugin.options.title %>
            // 模版地址
            template: path.resolve(appPath, 'index.html'),
            // 构建后的文件名和目录
            filename: 'index.html',
            //chunks这个参数告诉插件要引用entry里面的哪几个入口
            chunks:['app','vendor'],
            //要把script插入标签里
            inject:'body'
        }),

        new HtmlWebpackPlugin({
            // 改变页面的<title>标签的内容 
            title: 'Hello World appList', 
            // 模版地址
            template: path.resolve(appPath, 'list.html'),
            // 构建后的文件名和目录
            filename: 'list.html',
            //chunks这个参数告诉插件要引用entry里面的哪几个入口
            chunks:['list','vendor'],
            //要把script插入标签里
            inject:'body'
        }),

        // css
        // new ExtractTextPlugin("[name].css?[hash]"),

        // 热启动
        new webpack.HotModuleReplacementPlugin()
    ],

    // 查找依赖
    resolve:{

        // require或alias时不需要写后缀
        extensions: ["", ".js", ".jsx", ".css", ".json"],
    },

    // webpack-dev-server 配置
    // devServer: {
    //     port: 5000,                 // 端口
    //     contentBase: 'build',       // 内容目录
    //     hot: true,                  // 热刷新
    //     inline: true,
    //     // proxy: [                 // 设置代理服务器
    //     //     {
    //     //         path: ["/api","/user"], //
    //     //         target: "http://10.20.1.8:3002/", // 转发的服务器地址
    //     //         // rewrite: rewriteUrl('/$1\.json'),
    //     //         changeOrigin: true
    //     //     }
    //     // ]
    // }
}