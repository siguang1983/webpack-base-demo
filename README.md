
## webpack + webpack-dev-server + ES6 构建单/多入口项目基础配置

### 一、创建项目目录和基础配置文件

	// 创建项目目录并进行目录
	$ mkdir webpack_base_demo && cd webpack_base_demo  	

	// 创建文件
	$ touch README.md  .gitignore  .babelrc 

	// 创建package.json
	$ npm init 								

	// 配置.babelrc文件
	{
		"presets": ["es2015", "react", "stage-0", "stage-1", "stage-2", "stage-3"],
		"plugins": []
	}


### 二、安装webpack、webpack-dev-server

	$ npm i webpack webpack-dev-server --save-dev


### 三、安装插件

	// 如果使用react框架来做项目，先下载包
	$ npm i --save react react-dom

	// 使用Babel-loader来解析es6和jsx
	$ npm i babel-loader babel-core --save

	$ npm i babel-preset-es2015 babel-preset-react babel-preset-stage-0 babel-preset-stage-1 babel-preset-stage-2 babel-preset-stage-3 --save

	// jsx转换
	$ npm i jsx-loader --save

	// 解析样式文件
	$ npm install style-loader css-loader less-loader sass-loader  --save


### 四、其它插件

	1、html-webpack-plugin 插件将入口js文件直接构建到指定的html中，在输出到指定目录，这样不用手动在html引用js文件，通过插件来做
	
		$ npm i html-webpack-plugin 

	2、extract-text-webpack-plugin 单独打包css文件
	
		$ npm i extract-text-webpack-plugin

	3、open-browser-webpack-plugin   自动打开浏览器

		$ npm i open-browser-webpack-plugin

			var openBrowserWebpackPlugin = require('open-browser-webpack-plugin');
			plugin: [
			  new openBrowserWebpackPlugin({ url: 'http://localhost:8080' })
			]


### 五、创建webpack.config.js、webpack.production.config.js配置文件

	webpack.config.js 开发环境所用配置文件

	webpack.production.config.js  生产环境所用配置文件

	二者区别：

		webpack.config.js 开发时使用启用server, webpack.production.config.js 打包构建时使用不需要启动server，直接将代码执行到build目录
	

	$ touch webpack.config.js webpack.production.config.js

	webpack.config.js、webpack.production.config.js

	/**
	 * User: siguang
	 * Date: 2016/12/28
	 * Time: 15:04
	 */
	let webpack = require('webpack');
	let path = require('path');
	let HtmlWebpackPlugin = require('html-webpack-plugin');
	// let ExtractTextPlugin = require("extract-text-webpack-plugin"); // 单独打包CSS
	let openBrowserWebpackPlugin = require('open-browser-webpack-plugin');

	/*  文件路径配置 */
	let basePath = __dirname;
	let appPath = path.resolve(basePath, 'src');
	let buildPath = path.resolve(basePath, 'build');

	/* libs 目录下的库文件 */
	let libsPath = path.resolve(basePath, 'src/libs');
	let jquery = path.resolve(libsPath, 'jquery.min')

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
	        vendor: [jquery]
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

	        // 自动开启浏览器
        	new openBrowserWebpackPlugin({ url: 'http://localhost:5000' })
	    ],

	    // 查找依赖
	    resolve:{

	        // require或alias时不需要写后缀
	        extensions: ["", ".js", ".jsx", ".css", ".json"],
	    },

	    // webpack-dev-server 配置
	    devServer: {
	        port: 5000,                 // 端口
	        contentBase: 'build',       // 内容目录
	        hot: true,		            // 热刷新
	        inline: true,
	        // proxy: [                 // 设置代理服务器
	        //     {
	        //         path: ["/api","/user"], //
	        //         target: "http://10.20.1.8:3002/", // 转发的服务器地址
	        //         // rewrite: rewriteUrl('/$1\.json'),
	        //         changeOrigin: true
	        //     }
	        // ]
	    }
	}


### 四、访问入口 

	package.json

		"scripts": {
	        "start": "webpack-dev-server --hot --inline",
	        "build": "webpack --progress --profile --colors --config webpack.production.config.js"
	    },

	1、npm run start命令 如果服务启动成功，此命令不会构建到build目录中

		localhost://5000 			// 访问的index.html

		localhost://5000/list.html 	// 访问的list.html

	2、npm run build命令 开发完成后上线时将开发代码构建到build目录的生成目录

