---
title: TypeScript项目的基本构成
date: 2020-09-28
tags:
  - TS基础
categories:
  - 前端基础
---

## 编译上下文

  编译上下文是一个专业术语。它可以用来给文件分组, 告诉ts哪些文件是有效的、哪些是无效的。除了有效文件所携带的信息外, 编译上下文还包含```正在被使用的编译选项```的信息。定义这种逻辑分组一个比较好的方式是使用tsconfig.json文件。

  ### tsconfig.json

  - 编译选项
  
  通过在tsconfig.json中添加```compilerOptions```来定制编译选项.

  ```json
    {
      "compilerOptions": {
        /* 基本选项 */
        "target": "es5", // 指定ECMAScript的目标版本: es3(默认), es5
        "module": "common.js", // 指定使用的模块
        "lib": [], // 指定要包含在编译中的库文件
        "allowJs": true, // 允许编译js文件
          ...
        /* 严格的类型检查 */
        "strict": true  // 启用所有的严格类型选项
        ...,
        /* 额外的检查 */
        "noUnusedLocals": true, // 当有未使用的变量时报错

        /* 模块解析选项 */
        "moduleResolution": "node" // 选择模块解析策略

        /* SourceMap选项 */



        /* 其他选项 */


      }
    }
  ```

  关于common.js、AMD、CMD的诞生可以参考[这篇文章](https://www.cnblogs.com/moxiaowohuwei/p/8692359.html)。

  关于配置项的说明, 可以参考[这篇文章](https://jkchao.github.io/typescript-book-chinese/project/compilationContext.html#%E7%BC%96%E8%AF%91%E9%80%89%E9%A1%B9)。

  ### 指定文件

  可以在tsconfig.json中配置``` files ```来指定需要编译的文件

  ```json
    "files": ["./greeter.ts"]
  ```

  当然还可以使用```include```和```exclude``` 来指定包含的文件和排除的文件。

  ## 声明空间

  ### 类型声明空间

  类型声明空间包含用来当做类型注解的内容。例如

  ```ts
    class Foo {

    }

    interface Foo {

    }

    type Foo = {
      
    }
  ```

  我们可以将以上的类型声明,当做注解例如: 

  ```ts
  let foo : Foo
  ```

  > 虽然我们定义了Foo, 但是通过interface或者type定义的类型声明不能当成变量来使用。


  ### 变量声明空间

   ...

   同样的变量声明空间中的变量也不能当做类型注解。

  ## 模块
