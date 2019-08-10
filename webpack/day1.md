### webpack 简介

### 模块打包机

### ![image]('./img/webpack.png)

- 可以做什么事情？

* 代码转换(es6 -> es5)
* 文件优化(一些重复文件的优化)
* 代码分割
* 模块合并
* 自动刷新
* 代码校验
* 自动发布

### webpack.config.js 基本的配置说明(webpack是用node编写成的,因此我们用node的写法进行配置)

```
let path = require('path');
module.exports = {
  mode: 'development', // 当前打包的环境是开发环境还是生产环境
  entry: './src/index.js', // 打包的入口文件
  output: {    // 打包后文件的位置
    filename: 'bundle.js', // 文件名
    path: path.resolve(__dirname, 'build') // 文件路径,注意此路径为绝对路径(resove 方法可以把相对路径解析为绝对路径)
  }
};

```


