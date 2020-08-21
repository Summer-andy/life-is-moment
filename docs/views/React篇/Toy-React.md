---
title: 从0实现React框架(1)
date: 2020-08-15
tags:
  - React基础
categories:
  - React
---

## 搭建环境
  
  - 配置webpack.config.js
    
    1. 添加 ```babel-loader``` 将es高级语法转化为浏览器能够读懂的语法
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
                '@babel/plugin-transform-react-jsx'
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

  ### 新建html文件引入main.js

  为了更加直观的展示效果, 我们可以将打包后的script文件, 引入到html中。

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
  </body>
  <script src="dist/main.js" ></script>
  </html>
  ```

  ### 编写一段jsx

  我们在main.js中编写一段jsx语法, 然后在控制台查看```main.js```经过编译后的结果。

  ```js
  let a = <div id="hello">hello world!</div>
  ```

  经过webpack编译后, 我们发现jsx被编译成了:

<iframe
  src="https://carbon.now.sh/embed?bg=rgba(171%2C%20184%2C%20195%2C%201)&t=seti&wt=sharp&l=auto&ds=true&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=%2520%2520var%2520a%2520%253D%2520%252F*%2523__PURE__*%252FReact.createElement(%2522div%2522%252C%2520%257B%250A%2520%2520%2520%2520id%253A%2520%2522hello%2522%250A%2520%2520%257D%252C%2520%2522hello%2520world!%2522)%253B"
  style="width: 468px; height: 128px; border:0; transform: scale(1); overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>

 与此同时, 我们发现控制台报了一个错误❌.

 ```js
 Uncaught ReferenceError: React is not defined
    at eval (main.js:1)
    at Object../main.js (main.js:96)
    at __webpack_require__ (main.js:20)
    at main.js:84
    at main.js:87
 ``` 

 我们发现当``` @babel/plugin-transform-react-jsx ``` 解析jsx的时候, 会自动地从```React```中调用``` createElement ``` 方法。那么如果想要把```React.createElement``` 修改成 ``` ToyReact.createElement ``` 该怎么办呢？

我们通过查看babel官网中的插件列表, 可以详细地看到[babel-plugin-transform-react-jsx](https://www.babeljs.cn/docs/babel-plugin-transform-react-jsx)的用法。

  - pragma
    接收一个``` string ```类型的字符串, 默认值是```React.createElement```.
    当遇到jsx标签时, 将会用pragma的值去替换它。如果我们将pragma值设为 ``` ToyReact.createElement ```, 那么main.js中的代码将会被解析成:

      <iframe
      src="https://carbon.now.sh/embed?bg=rgba(171%2C%20184%2C%20195%2C%201)&t=one-dark&wt=sharp&l=auto&ds=true&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=var%2520a%2520%253D%2520ToyReact.createElement(%2522div%2522%252C%2520%257B%250A%2520%2520id%253A%2520%2522hello%2522%250A%257D%252C%2520%2522hello%2520world!%2522)%253B%250A"
      style="width: 367px; height: 146px; border:0; transform: scale(1); overflow:hidden;"
      sandbox="allow-scripts allow-same-origin">
    </iframe>

  - pragmaFrag
    接收一个 ``` string ```类型的字符串, 默认值是 ``` React.Fragment ```
    当解析到空标签时, 会使用pragmaFrag的值替换它。比如我们将 ``` main.js ```的内容改成
    ``` let a = <>hello world!</> ```。那么解析后的结果是:

    <iframe
    src="https://carbon.now.sh/embed?bg=rgba(171%2C%20184%2C%20195%2C%201)&t=one-dark&wt=sharp&l=auto&ds=true&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=var%2520a%2520%253D%2520ToyReact.createElement(React.Fragment%252C%2520null%252C%2520%2522hello%2520world!%2522)%253B"
    style="width: 620px; height: 92px; border:0; transform: scale(1); overflow:hidden;"
    sandbox="allow-scripts allow-same-origin">
    </iframe>

  - useBuiltIns
    接收一个 ``` Boolean ``` 类型的值, 默认值是 ``` false ```
    当传递prop的时候,直接用```Object.assign()```方法, 而不是其他的Babel插件。
  - useSpread
  - throwIfNamespace

   我们更新一下```webpack.config.js```的配置,

   ```js
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: [[
          '@babel/plugin-transform-react-jsx',
          {
            pragma: 'ToyReact.createElement',
            pragmaFrag: 'ToyReact.Fragment'
          }
        ]]
      }
    }
   ```

 ## 编写ToyReact

  ### 创建ToyReact.js

  由于我们并没有编写ToyReact的相关内容, 因此控制台会报错。接下来, 我们新建```ToyReact.js```,
  并且新增一个``` createElement ``` 方法来创建一个实体DOM。

  那么``` createElement ```方法如何写呢?
  
  ```js
  var a = ToyReact.createElement("div", {
    id: "hello"
  }, "hello world!");
  ```

  我们发现,```createElement``` 传递三个参数

   - 标签的类型
   - 属性
   - 子节点
  
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

  我们通过调用```document.createElement``` 方法创建实体DOM, 并且遍历jsx的上的自定义属性,将各个属性挂载到实体DOM中。我们可以在控制台打印``` createElement ``` 方法返回的值。

  ```html
    <div id="hello"></div>
  ```

  这时候返回的是实体DOM, 貌似还缺点什么❓emm, 子节点好像没有考虑, 我们可以先简单处理一下children(后面优化)

  ```diff
  export const ToyReact = {
    createElement(type, attributes, ...children) {
      const element = document.createElement(type);
      for (let name in attributes) {
        element.setAttribute(name, attributes[name])
      }

  +   for (let child of children) {
  +      const node = document.createTextNode(child)
  +      element.appendChild(node)
  +    }
      return element;
    }
  }
  ```

  接下来我们将实DOM插入到文档就可以看到 hello world!了。

  ```js
  import { ToyReact } from './ToyReact';
  let a = <div id="hello">hello world!</div>
  document.body.appendChild(a);
  ```

  ### 重构ToyReact.js

  为了保持与React API的风格一致, 我们需要改变一下main.js的代码

  ```js
  import { ToyReact } from './ToyReact';

  class TestComponent {
    render() {
      return <div id="hello">hello world!</div>
    }
  }

  ToyReact.render(<TestComponent />, document.body)
  ```
  我们发现新的代码比之前的代码多了一个render的方法, 并且也使用类的写法通过render返回jsx. 那么应该从何处着手修改ToyReact里面的代码呢？

  - 实例化TestComponent, 获取它return的jsx
  - render还是负责将实DOM插入到document.body中

    #### 修改createElement

    首先我们需要判断一下``` type ```的类型, 因为传进来的type不再是之前的元素标签(比如div)字符串了。而是变成了``` function ```.其次呢, 我们最好将元素、文本节点剥离开来。元素是可以被添加属性以及子节点的, 而在文本节点上我们不能做任何事情。剥离开来的目的是为了让```createElement```方法变得不那么臃肿, 同时将元素和文本抽离出来, 各自的逻辑，维护起来也更加方便。

      <iframe
      src="https://carbon.now.sh/embed?bg=rgba(171%2C%20184%2C%20195%2C%201)&t=one-dark&wt=sharp&l=auto&ds=true&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=0px&ph=0px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=export%2520const%2520ToyReact%2520%253D%2520%257B%250A%2520%2520createElement(type%252C%2520attributes%252C%2520...children)%2520%257B%250A%2520%2520%2520%2520%250A%2520%2520%2520%2520const%2520element%2520%253D%2520document.createElement(type)%253B%250A%2520%2520%2520%2520%250A%2520%2520%2520%2520for%2520(let%2520name%2520in%2520attributes)%2520%257B%250A%2520%2520%2520%2520%2520%2520element.setAttribute(name%252C%2520attributes%255Bname%255D)%250A%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%250A%250A%2520%2520%2520%2509for%2520(let%2520child%2520of%2520children)%2520%257B%250A%2520%2520%2520%2520%2520%2520const%2520node%2520%253D%2520document.createTextNode(child)%250A%2520%2520%2520%2520%2520%2520element.appendChild(node)%250A%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%250A%2520%2520%2520%2520return%2520element%253B%250A%2520%2520%257D%250A%257D"
      style="width: 459px; height: 398px; border:0; transform: scale(1); overflow:hidden;"
      sandbox="allow-scripts allow-same-origin">
    </iframe>

   #### 定义ElementWrapper类

   新建ElementWrapper类,并且新增 ```创建实体DOM```方法 以及 ```setAttribute```和 ``` appendChild ``` 方法。

  ```js
  class ElementWrapper {
      constructor(type) {
        this.root = document.createElement(type)
      }

      setAttribute(name, value) {
        this.root.setAttribute(name, value)
      }

      appendChild(component) {
        this.root.appendChild(component.root)
      }
  }
  ```

   ::: warning
  以上appendChild方法中```component``` 都是经过 ``` ElementWrapper``` 或者
  ``` TextNodeWrapper ``` 实例化后的值。
  ```component.root``` 指代的即是元素节点或者文本节点。
   :::

   #### 定义TextNodeWrapper类

   新建TextNodeWrapper类, 并且只需要创建一个文本节点即可。

  ```js
  class TextNodeWrapper {
    constructor(content) {
      this.root = document.createTextNode(content);
    }
  }
  ```

  #### 修改createElement方法

  ```js
  createElement(type, attributes, ...children) {
    let element;
    // 判断element的类型, 如果是元素标签的字符串类型, 那么就通过ElementWrapper创建实DOM, 否则就直接实例化本身返回其render的jsx, 进行重新调用createElement构建元素。
    if(typeof type === 'string') {
       element = new ElementWrapper(type);
    } else {
      element = new type;
    }

    for (let name in attributes) {
      element.setAttribute(name, attributes[name])
    }

    for (let child of children) {
      // 如果child是字符串那么直接实例化TextNodeWrapper,得到文本节点。
      if(typeof child === 'string') {
        child = new TextNodeWrapper(child)
      }
      element.appendChild(child)
    }
    
    return element;
  },

  ```