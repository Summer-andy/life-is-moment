---
title: Sourcemap源码映射之VLQ编码
date: 2021-05-30
tags:
 - 随笔记录
categories:
 - 前端基础
---

## 前言

   ``` Sourcemap ```其实是一个信息对应文件, 里面存储着代码转换前后对应的信息位置。转换前后的代码对应着的就是源代码和生产代码。它本质上解决了在打包过程中, 代码经过babel编译转化后, 由于代码差异性过大, 造成无法debug的问题。

## Sourcemap原理

   我们从Sourcemap的结构开始学习它的映射机制。

   ```js
    {
     "version":3, // Sourcemap 使用的是第三版标准产出的
     "sources":["test1.js","test2.js"],
     "names":["getName","name","getAge","age"],
     "mappings":"AAAA,SAASA,QAAQC,MACf,MAAO,aAAeA,KCDxB,SAASC,OAAOC,KACd,MAAO,YAAcA"
    }
   ```

   一般Sourcemap主要是通过 ``` uglify-js ``` 生成的。比如我们可以通过以下的命令压缩以下两个文件。

  ```sh
  npx uglifyjs test.js test2.js -o output.js --source-map "url='output.js.map'"
  ``` 

  // test1.js

   ```js
    function getName(name) {
      return 'my name is' + name;
    }
   ```

  // test2.js

   ```js
    function getName(name) {
      return 'my name is' + name;
    }
   ``` 

   ``` sources ``` 指的就是被开启Sourcemap的压缩源文件。也就是 ``` test1.js ``` 和 ``` test2.js ```.

   ``` names ``` 指的是转化前所有的变量名和属性名。

   ``` mappings ``` 的内容是指 转化前和转化后的映射集合关系的集合, ```分号(;)```代表一行,  每行的 mapping用``` 逗号(,) ```分开。

   