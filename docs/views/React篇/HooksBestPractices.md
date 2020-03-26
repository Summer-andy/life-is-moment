---
title: React Hooks - 重新认识useEffect
date: 2020-03-24
tags:
  - React基础
categories:
  - React
---

#### 我们先来看一个简单的例子。需求是这样子的, 每当你点击 count+1 的按钮时 count 的数量会加 1, 然后当我们点击触发事件按钮的时候能输出 count 的最终值。

```js
import React, { Fragment, useState, useEffect } from 'react';
import { Emitter } from './event';
const Layout = () => {
  const [count, setCount] = useState(1);

  const handleTrigger = () => {
    Emitter.emit('click', '🐶');
  };

  useEffect(() => {
    Emitter.on('click', data => {
      console.log(`i am ${count} 号 ${data}仔`);
    });
  }, [count]);

  return (
    <Fragment>
      <button onClick={() => setCount(count + 1)}>点击count+1</button>
      <button onClick={handleTrigger}>点击触发事件</button>
    </Fragment>
  );
};

export default Layout;
```

#### 运行完以上代码,我们会发现我点击3次会输出4次🐶, 分别是
```
i am 1 号 🐶仔
i am 2 号 🐶仔
i am 3 号 🐶仔
i am 4 号 🐶仔
```

当我们再次点击count+1的按钮3次时会输出
```
i am 1 号 🐶仔
i am 2 号 🐶仔
i am 3 号 🐶仔
i am 4 号 🐶仔
i am 5 号 🐶仔
i am 6 号 🐶仔
i am 7 号 🐶仔
```
这跟我们想的完全不一样。我们想要的结果是
```
i am 4 号 🐶仔
```

```
i am 7 号 🐶仔
```

发现了问题后,我们开始解决问题,可能有的同学会说这还不简单, 直接写点小算法取最后一次的数据不就ok了嘛。但是这种方法肯定不是最佳的,官方肯定有最优解。我们来看一下useEffect的官方说明:

```
Accepts a function that contains imperative, possibly effectful code.

Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a function component (referred to as React’s render phase). Doing so will lead to confusing bugs and inconsistencies in the UI.

Instead, use useEffect. The function passed to useEffect will run after the render is committed to the screen. Think of effects as an escape hatch from React’s purely functional world into the imperative world.

By default, effects run after every completed render, but you can choose to fire them only when certain values have changed.

```

我们大致翻译一下, 他的意思是说,Hooks的主体接受一个命令式,并且可能会有副作用的函数。在React渲染阶段,改变DOM,添加订阅，设置定时器以及其他包含副作用的操作是不被允许,因为这会产生意料之外的bug并且会破坏UI的一致性(React把组件看成是一个状态机。通过人机交互,实现不同的状态然后渲染UI, 让界面和数据保持一致)。那么很明显, 我们在useEffect中的代码块是有副作用的,那么怎么办呢？原来useEffect是支持清除副作用的,就是说每一次count发生变化,在执行下一次useEffect的时候,会清除上一次的副作用。也就是说如果我们不清除副作用的话,这个钩子会执行以下操作: 

```js
 useEffect(() => {
  Emitter.on('click', data => {
      console.log(`i am ${1} 号 ${data}仔`);  // 此时count为1
  });


  Emitter.on('click', data => {
      console.log(`i am ${2} 号 ${data}仔`); // 此时count为2
  });

  Emitter.on('click', data => {
      console.log(`i am ${3} 号 ${data}仔`); // 此时count为3
  });

 ...
 
 }, [count])
```

假如我们一直点count+1, 一旦我们触发了click, 那么在effect中, 就会输出n多次。因此我们需要在每一次新的effect执行前,清除上一次的监听事件。我们修改代码为如下代码,即可满足我们的需求了。

```js
import React, { Fragment, useState, useEffect } from 'react';
import { Emitter } from './event';
const Layout = () => {
  const [count, setCount] = useState(1);

  const handleTrigger = () => {
    Emitter.emit('click', '🐶');
  };

  const func = data => {
    console.log(`i am ${count} 号 ${data}仔`);
  };

  useEffect(() => {
    Emitter.on('click', func);
    return () => {
      Emitter.removeListener('click', func);
    };
  }, [count]);

  return (
    <Fragment>
      <button onClick={() => setCount(count + 1)}>点击count+1</button>
      <button onClick={handleTrigger}>点击触发事件</button>
    </Fragment>
  );
};

export default Layout;
```

#### 总结:   1. 在useEffect中如果使用了订阅监听、定时器等函数时, 一定要在useEffect中取消或者清除它
            2. useEffect中的清除的副作用实际上清除的是上一次useEffect中产生的副作用。
            3. 看知识点一定要耐心细心, 不能囫囵吞枣。 