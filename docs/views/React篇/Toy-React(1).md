---
title: 从0实现React框架(1)
date: 2020-04-27
tags:
  - React基础
categories:
  - React
---

### 搭建环境
  
  - 配置webpack
    
    1. 添加```babel-loader```, 将高级语法转化为浏览器能够读懂的语法
    2. 使用 ```@babel/preset-env ```作为预转译插件
    3. 使用 ```@babel/plugin-transform-react-jsx``` 解析jsx语法糖

  ```js
  module.exports = {
    entry: {
      main: './main.js'
    },
    module: {
      rules: [
        {
          test:  /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [[
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'ToyReact.createElement'
                }
              ]]
            }
          }
        }
      ]
    },
    optimization: {
      minimize: false
    },
    mode: 'development'
  }
  ```

  ### 编写一段jsx

  我们在main.js中编写一段我们熟悉的jsx语法。

  ```js
  let a = <div id="hello">hello world!</div>
  ```

  经过webpack编译后, 我们发现jsx被编译成了:

  ```js
  var a = ToyReact.createElement("div",  { id: "hello" }, "hello world!");
  ```
  
  很明显, 我们需要一个在ToyReact中编写一个createElement方法。因此我们新建一个ToyReact.js文件, 并且定义一个createElement方法。

  ### 在ToyReact中新增createElement方法

  createElement中的第一个参数是jsx的类型, 第二个参数是jsx上的属性, 第三个参数是jsx的子元素。

  我们使用 ``` document.createElement ``` 创建一个实际的DOM元素, 然后将jsx上的属性都作为自定义属性赋值到新创建的DOM中。

  ```js
  export const ToyReact = {
    createElement(type, attributes, ...children) {
      const element = document.createElement(type);
      
      for (let name in attributes) {
        element.setAttribute(name, attributes[name])
      }

      return element;
    }
  }
  ```

