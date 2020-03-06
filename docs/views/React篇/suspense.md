---
title:  React源码阅读之Suspense
date: 2017-09-21
tags:
  - React源码
categories:
  - React
---

### React源码阅读之Suspense

##### 首先来简单的介绍一下Suspense: React 16.6 added a <Suspense> component that lets you “wait” for some code to load and declaratively specify a loading state (like a spinner) while we’re waiting。这段话的意思呢就说 React16.6版本新增了Suspense组件来让你的组件异步加载的时候可以指定loading动画。

##### 接下来,我们先看一段代码：

```
import React, { Suspense, lazy } from 'react'
const LazyComp = lazy(() => import('./lazy.js'))
const LazyComp1 = lazy(() => import('./lazy1.js'))
let data = ''
let promise = ''
function requestData() {
  if (data) return data
  if (promise) throw promise
  promise = new Promise(resolve => {
    setTimeout(() => {
      data = 'Data resolved'
      resolve()
    }, 2000)
  })
  throw promise
}

function SuspenseComp() {
  const data = requestData()

  return <p>{data}</p>
}

export default () => (
  <Suspense fallback={ <div>loading</div>}>
    <SuspenseComp />
    <LazyComp />
    <LazyComp1 />
  </Suspense>
)

```

##### 大致分析一下上述代码: 首先我们引用了Suspense组件,然后在该组件中定义三个子组件。其中SuspenseComp组件做了小小的处理, 我们将Promise挂起.等到2s后完成Promise的执行,返回data。在这两秒期间界面会一直显示loading, 直到2s后显示3个组件的内容。除此之外我们还发现,使用了lazy这个api.webpack会自动将我们的代码切块。
![image](./img/lazy.jpg)


##### 源码分析

```
export function lazy<T, R>(ctor: () => Thenable<T, R>): LazyComponent<T> {
  return {
    $$typeof: REACT_LAZY_TYPE,
    _ctor: ctor,
    // React uses these fields to store the result.
    _status: -1,
    _result: null,
  };
}
```

##### lazy函数通常接收一个Promise.然后返回一个LazyCompoent。我们来看一下lazy返回了设什么？ 首先是$$typeof 表示我的类别。_ctor指的就是传进来的function._status值是Promise的状态.-1 表示pending. _result指的是resolve后返回的组件。