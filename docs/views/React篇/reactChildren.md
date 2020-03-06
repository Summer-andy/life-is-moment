---
title: React源码阅读之React.Children.map
date: 2017-09-21
tags:
  - React源码
categories:
  - React
---


### React源码阅读之React.Children.map

#### 我们来看一个简单的案例, 首先前端老大提出的需求是这样的: 设计一个wrap组件, 并且需要给Wrap组件里面的每一个子元素(至少一个元素)都添加一个样式属性className="wrap-class"。


##### 这时候小明同学三下五除二的撸完了代码,他的代码如下：
```

import React from 'react'

function WrapComponent(props) {
  return props.children.map(Item => <div className="wrap-class">{Item}</div>)
}

export default () => (
  <WrapComponent>
    <span>我是子元素1</span>
    <span>我是子元素2</span>
    <span>我是子元素3</span>
  </WrapComponent>
)

```
##### 小明同学提交了代码,说老大我代码写好啦。可以让小美同学测试啦(胸有成竹ing!!!)。这时候小美同学编写了以下测试用例, 发现小明同学写的代码有bug。小美立马呼叫小明: 小明同学前端界面崩啦！

```
import React from 'react'

function WrapComponent(props) {
  return props.children.map(Item => <div className="wrap-class">{Item}</div>)
}

export default () => (
  <WrapComponent>
    <span>我是子元素1</span>
  </WrapComponent>
)
```
![image](./img/children.jpg)

##### 小明同学一听到小美同学☎️说, 界面崩了，顿时慌了。立马打开电脑, 开始仔细地排查问题。聪明的小明同学发现当WrapComponent组件下只有一个元素的时候props.children的类型是一个```obejct```，而不是```array```。这时候小明同学打开的React官网看了看对children的介绍: this.props.children是一个不透明的数据结构。就是说它的类型可能是一个string或者是obejct又或者是array等等。那怎么解决这种不确定性呢？React提供了一个```Children``` API。小明同学看了官网的介绍后改了改代码，发现不报错了。

```
import React from 'react'

function WrapComponent(props) {
  return React.Children.map(props.children, item => [ <div className="wrap-class">{item}</div> ])
}

export default () => (
  <WrapComponent>
    <span>我是子元素1</span>
  </WrapComponent>
)
```