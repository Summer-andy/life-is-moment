---
title: node包学习之chokidar
date: 2021-05-28 12:23:22
tags:
 - 随笔记录
categories:
 - 前端基础
---

## 前言

   chokidar是一个可以用来监听node中文件的新增修改删除等等操作的一个包, 接下来我们来学习一下它的用法。

## 监听当前文件夹下所有的文件操作

  ```js
  const chokidar = require('chokidar');
  chokidar.watch('.').on('all', (event,path) => {
    console.log(event, path)
  })
  ```

  其中event代表对文件的操作, 比如新增删除改动。

  假如你在当前文件夹下面新增了一个test.js， 那么上述代码会输出

  ```js
  add test.js
  ```

  ```add``` 代表的就是事件event, path即是文件的路径。

  如果我们修改了 test.js 那么会输出

  ```js
  change test.js
  ```

## 高级用法

   当然我们也可以先初始化监听器, 我们可以在watch参数里面指定文件文件夹数组正则等等。同时我们也可以添加raw, 获取更加详细的监听信息。



   ```js
  const chokidar = require('chokidar');
  const watcher = chokidar.watch('./test', {
    ignored: /(^|[\/\\])\../, 
    persistent: true
  });

  const log = console.log.bind(console);

  watcher
    .on('add', path => log(`File ${path} has been added`))
    .on('addDir', path => log(`Directory ${path} has been added`))
    .on('raw', (event, path, details) => { // internal
    log('Raw event info:', event, path, details);
  });

  ```
  
  ```js
  { 
  path: '/Users/mac/Desktop/nodeTest/test/12323.js',
  flags: 70656,
  event: 'modified',
  type: 'file',
  changes: { inode: true, finder: false, access: false, xattrs: false } 
  }
  ```

  同时我们也可以对监听器进行移出某个文件监听的操作

  ```js
  watcher.unwatch('new-file*');
  ``` 

  如果我们想关闭监听器,执行close方法即可。

  ```js
  watcher.close().then(() => console.log('closed'));
  ```