#### 这一次我真的搞懂了Babel
   前言: 之前虽然大致看了看Babel相关的知识,但是并没有深入了解。本文前半部分先详细介绍一下Babel是如何编译ES6+代码并且转化为浏览器能够理解的代码, 后半部分将会实现一个简单的babel插件。

#### 什么是Babel？
    Babel is a compiler for writing next generation JavaScript.Babel是编写下一代JavaScript的编译器。

#### Babel的作用？
    帮我们编写的es6,es7...解析成浏览器能够理解的代码

#### Babel是如何完成解析工作的？
 - 解析: 使用[babel-parser](https://github.com/babel/babel/tree/master/packages/babel-parser)将我们编写的高级JS代码转化成AST语法树。
 - 转换: 配合[babel-traverse](https://github.com/babel/babel/tree/master/packages/babel-traverse)将AST语法树进行遍历转换。
 - 生成: 使用[babel-generator](https://github.com/babel/babel/tree/master/packages/babel-generator)将转换后的AST语法树转化为JS代码。

##### 接下来我们开始第一步:```解析 ```
 - 在开始之前我们先介绍一下这一步涉及到的名词: ```AST```。它的全称是Abstract Syntax Tree(抽象语法树)。在百度百科中, 它是这么介绍的: 在计算机科学中,抽象语法树是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构,树上的每一个节点都表示源代码的结构。其实简单可以理解为:``` 它就是我们所编写代码的树状结构化的一种表现形式  ```。
 - 有了基本的概念之后我们来举一个例子来说明一下这个过程。
   ```
   function getResult(x, y) {
     return x + y;
   }
   ```
   在下面的解释中会出现一些关键词。我们先不用深究,先理解这个过程。首先当我们的``` babel-parser ```遇到这个代码块的时候,他会认为这是一个FunctionDeclaration(函数定义)对象。然后他会先把这一大块拆成三个小块:

   -  id: 就是它的名称标识getResult
   -  两个参数: [x,y]
   -  一大块Body: ``` { return x + y } ```
  
    第一块已经无法继续拆下去了那么它就会被解析成: 
      ```
      {
        name: 'getResult'
        type: 'Identifier',
        ...
      }
      ```

    第二块就是一个数组,它也无法拆下去了,同样的它被解析成:
      ```
      [
        {
        name: 'x'
        type: 'Identifier',
        ...
        },
        {
        name: 'y'
        type: 'Identifier',
        ...
        }
      ]
      ```
     第三块是一个Body,很明显第三块还可以继续拆: 首先解析器解析到了一个BlockStatement(块区域)对象, 它用来表示 ``` { return x + y } ```.继续解析它我们得到了一个 ReturnStatement(Return域)对象, 它用来表示return ``` x + y ```;我们再解析它,我们又得到了一个BinaryExpression(二项式)对象,它用来表示 ``` x + y ```;我们再解析这个二项式对象,它分成了三部分, ```  left ```,```  operator ```, ``` right ```

     - left： x
     - operator: +
     - right: y
     下面这张图就是这个function解析后AST树的样子。
      ![image](./Babel.png)